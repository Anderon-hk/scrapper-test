import { ElementHandle } from "puppeteer";

export default class ScrapperJob {
    #page;
    controller;
    savePath;

    constructor(page, savePath, controller) {
        this.#page = page
        this.savePath = savePath
        this.controller = controller
    }

    async run() {
        let nextButton = null;
        do {
            let articleList = await this.getArticlesInPage()

        }
        while(nextButton != null);

        let name = await this.getArticleName(articleList[0])
        console.log(`opening ${name}`)
        await this.openArticle(articleList[0])
        await this.#page.waitForNetworkIdle({})
        await this.savePdf(name)
        await this.#page.goBack({
            waitUntil: 'networkidle0'
        })
    }

    /**
     * 
     * @returns {[ElementHandle]}
     */
    async getArticlesInPage() {
        let listContainer = await this.#page.$('div.bookList');
        return await listContainer.$$('a');
    }

    async getArticleName(article) {
        if (!article) return;

        let name = await article.$eval(
            '.caption',
            node => node.innerText.replace('\n', ' ')
        )

        return name
    }

    async openArticle(article) {
        await article.click();
    }

    async savePdf(fileName) {
        const path = this.savePath + fileName + '.pdf'
        await this.#page.emulateMediaType('screen')
        console.log(`save pdf to ${path}`)
        await this.#page.pdf({
            path: path,
            width: parseInt(process.env.VIEWWIDTH) || 1920,
            height: parseInt(process.env.VIEWHEIGHT) || 1080,
        });
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
    
    /**
     * 
     * @param {[ElementHandle]} articles 
     */
    async processArticlesInPage(articles) {
        if(articles) {
            
        }
    }
}