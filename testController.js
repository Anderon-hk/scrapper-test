import 'dotenv/config'
import { config } from 'dotenv';
import puppeteer from "puppeteer";
import ScrapperController from './ScrapperController.js';
config({override: true});

const url = process.env.TESTURL
const browser = await puppeteer.launch({
    executablePath: process.env.BROWSERPATH || '/usr/bin/google-chrome',
    headless: false,
});


let controller = new ScrapperController('./articles', url, browser)
await controller.prepare()
await controller.start()
// // await controller.login()
// let items = await controller.getNavItem() //seems ok
// let catPage = await controller.openPageForElement(items[0]); //seems ok
// // let articles = await controller.getArticlesInpage(catPage) 
// // console.log(articles)
// let nextPage = await controller.getNextPageButton(catPage);
// console.log(`next button url ${nextPage}`);
// await browser.close()

// let controller = new ScrapperController('./articles');
// await controller.writeVisitedFile();
// await controller.readVisitedFile();