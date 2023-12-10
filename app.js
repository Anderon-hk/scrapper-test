// ref: https://dev.to/cloudx/how-to-use-puppeteer-inside-a-docker-container-568c
import puppeteer from "puppeteer";
import 'dotenv/config'

//use headless mode with config headless: 'new' for new headless implementation
const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: false
    
});

let page = await browser.newPage();
await page.goto(process.env.URL, {
    waitUntil: 'networkidle2'
});

// await page.screenshot(
//     {
//         path: "test.png"
//     }
// );
// browser.waitUntil()
// await browser.close();