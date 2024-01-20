import { accessSync } from "node:fs"
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ElementHandle } from "puppeteer";
import { Browser, Page } from "puppeteer";
import ScrapperJob from "./ScrapperJob.js";

export default class ScrapperController {

    #visitedArticles
    #filePath
    #target
    #browser
    /**
     * @type {Page}
     */
    #startPage
    #readArticlesFileUrl = 'readArticles'

    /**
     * Description
     * @param {string} file
     * @param {string} target
     * @param {Browser} browser
     * @returns {void}
     */
    constructor(file, target, browser) {
        this.#visitedArticles = new Set();
        this.#filePath = file;
        this.#target = target;
        this.#browser = browser
    }


    async prepare() {

        console.log('check printed file');
        await this.readVisitedFile();

        console.time('prepare: new Page')
        this.#startPage = await this.#browser.newPage()
        console.timeEnd('prepare: new Page')
        console.time('prepare: go to target')
        await this.#startPage.goto(this.#target, {
            waitUntil: 'networkidle0'
        });
        console.timeEnd('prepare: go to target')
        console.log('prepare: done')
    }

    async login() {
        let loginbtn = await this.#startPage.waitForSelector('a::-p-text(登入)');
        await loginbtn.click();
        // let locator = await this.#startPage.locator('a.menu')
        // let lgin = await locator.filter(
        //     link => {
        //         console.log(link.innerText);
        //         return link.innerText == '登入';
        //     }
        // );
        // await lgin.click();
        // .filter(link => {console.log(link.innerText); return link.innerText == '登入'})
        // .click()
        
        // await this.#startPage.waitForNetworkIdle()
        return;
    }

    /**
     * 
     * @param {string} title 
     * @returns {boolean}
     */
    articlesVisted(title) {
        return this.#visitedArticles.has(title)
    }

    async readVisitedFile() {
        let accessible = false
        //check if file exists 
        try {
            let file = await access( path.resolve(this.#filePath, this.#readArticlesFileUrl) )
            accessible = true
        }catch(e ) {
            console.log('file not exits'); 
        }
        
        if(accessible) {
            
            try {
                //the flag to avoid error if file is not exits and create one
                let data = await readFile(
                    path.resolve(this.#filePath, this.#readArticlesFileUrl),
                    {flag:'a+'}
                )
                if(data) {
                    data = JSON.parse(data)
                    this.#visitedArticles = new Set(data)
                }
            }
            
            catch (e) {
                console.error('error on read visited article file')
                console.error(e.message);
                this.#browser.close();
            }
        }
        //test only
        console.log(this.#visitedArticles)
    }

    async writeVisitedFile() {

        let savePath = path.resolve(this.#filePath, this.#readArticlesFileUrl)
        let articlesArray = Array.from(this.#visitedArticles)

        //make dirs if not exits
        await mkdir(this.#filePath, {recursive: true})
        
        await writeFile(
            savePath,
            JSON.stringify(articlesArray)
        )
    }

    markVisited(title) {
        this.#visitedArticles.add(title)
    }

    async start() {
        // get the cat list
        let catList = this.getNavItem();
        let cat1 = catList[0];

        //open new page for cat
        let page = this.openPageForElement(cat1);

        let job = new ScrapperJob(page, this.#filePath, this);
        await job.run();
    }

    /**
     * get the category tab items in the page
     * @returns {[{link: string, name:string}]}
     */
    async getNavItem() {
        const categories = await this.#startPage.$$('body > div.Library > div.topNavBar > div.list > ul > li');
        
        let result = []
        for(let item of categories) {
            //data is undefined
            let data = await item.$eval('a', (tag) => { 
                let link = tag.href;
                let name = tag.innerText;
                return {
                    link,
                    name
                }
             });
            result.push({
                link: data.link,
                name: data.name
            });
        }
        return result;
    }

    /**
     * To create a new page of a category
     * @param {{link: string, name:string}} element 
     * @returns {Page}
     */
    async openPageForElement(element) {
        console.log(`scrapping ${element.name}`)
        let catPage = await this.#browser.newPage()
        await catPage.goto(element.link, {
            waitUntil: 'networkidle0'
        });

        return catPage
        
    }
}