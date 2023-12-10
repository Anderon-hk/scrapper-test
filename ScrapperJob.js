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
        let articleList = await this.getArticlesInPage()

        let name = await this.getArticleName(articleList[0])
        console.log(`opening ${name}`)
        await this.openArticle(articleList[0])
        await this.#page.waitForNetworkIdle({})
        await this.savePdf(name)
        await this.#page.goBack({
            waitUntil: 'networkidle0'
        })
    }

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
    
}