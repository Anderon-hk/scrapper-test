import 'dotenv/config'
import ScrapperJob from './ScrapperJob.js'
import puppeteer from 'puppeteer'

const url = process.env.TESTURL

const browser = await puppeteer.launch({
    executablePath: process.env.BROWSERPATH || 'usr/bin/google-chrome',
    headless: false,
    // defaultViewport: {
    //     width: parseInt(process.env.VIEWWIDTH) || 1920,
    //     height: parseInt(process.env.VIEWHEIGHT) || 1080,
    // }
});

const page = await browser.newPage()
await page.goto(url, {
    waitUntil: 'networkidle0'
});

let job = new ScrapperJob(page, './articles/', {})
await job.run()

await browser.close()
