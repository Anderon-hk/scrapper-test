import { accessSync } from "node:fs"
import { ElementHandle } from "puppeteer";
import { Browser, Page } from "puppeteer";

export default class ScrapperController {

    #visitedArticles
    #filePath
    #target
    #browser
    /**
     * @type {Page}
     */
    #startPage

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

        if(accessSync(this.#filePath)) {
            
        }
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

    readVisitedFile() {}

    writeVisitedFile() {}

    markVisited(title) {
        this.#visitedArticles.add(title)
    }

    async start() {}

    /**
     * 
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
     * 
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

    /**
     * 
     * @param {Page} page
     * @returns { [ {name: string, article: string} ] }
     */
    async getArticlesInpage(page) {
        let list = [];
        let bookList = await page.$$('a.bookItem');
        console.log(`size: ${bookList.length}`)
        for (let item of bookList) {
            let article = {}
            //get the link and title
            article = await item.evaluate(ar => {
                let name = ar.querySelector('.caption').innerText
                name = name.replace('\n', ' ')
                let link = ar.href
                return {
                    name,
                    article: link
                }
            });
            article.article = item.href
            //not sure why can push and stoped
            list.push(article)
        }
        return list;
    }

    /**
     * @param {Page} page 
     * @returns {string} the url of the next button
     */
    async getNextPageButton(page) {
        return await page.$eval('span.step-links > a.right', (btn) => btn.href);
    }
}