import 'dotenv/config'
import puppeteer from "puppeteer";
import ScrapperController from './ScrapperController.js';
const url = process.env.TESTURL
const browser = await puppeteer.launch({
    executablePath: process.env.BROWSERPATH || '/usr/bin/google-chrome',
    headless: false,
});


let controller = new ScrapperController('./', url, browser)
await controller.prepare()
// await controller.login()
let items = await controller.getNavItem() //seems ok
let catPage = await controller.openPageForElement(items[0]); //seems ok
// let articles = await controller.getArticlesInpage(catPage) 
// console.log(articles)
let nextPage = await controller.getNextPageButton(catPage);
console.log(`next button url ${nextPage}`);
await browser.close()