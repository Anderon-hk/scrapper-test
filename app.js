// ref: https://dev.to/cloudx/how-to-use-puppeteer-inside-a-docker-container-568c
import puppeteer from "puppeteer";

//use headless mode with config headless: 'new' for new headless implementation
const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: false,
    // args:[
    //     '--no-sandbox',
    //     '--disable-setuid-sandbox'
    // ]
    
});
let page = await browser.pages()[0].page;
await page.goto("https://youtube.com", {
    waitUntil: 'networkidle2'
})
// await page.screenshot(
//     {
//         path: "test.png"
//     }
// );
// browser.waitUntil()
// await browser.close();