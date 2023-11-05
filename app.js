// ref: https://dev.to/cloudx/how-to-use-puppeteer-inside-a-docker-container-568c
import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    // headless: false,
    // args:[
    //     '--no-sandbox',
    //     '--disable-setuid-sandbox'
    // ]
});
let page = await browser.newPage();
await page.goto("https://google.com")
await page.screenshot(
    {
        path: "test.png"
    }
)
await browser.close();