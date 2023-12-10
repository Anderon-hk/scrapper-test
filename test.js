import 'dotenv/config'
import { accessSync, read } from "node:fs"
import { readFileSync } from 'node:fs'
import puppeteer from 'puppeteer'

// console.log(process.env["VISITEDFILE"])

// try {
//     // if(accessSync(process.env["VISITEDFILE"])) {
//     //     console.log("file exits")
//     // }
//     let data = readFileSync(process.env["VISITEDFILE"])

// }
// catch(e) {
//     console.error(e.message)
//     console.log(e)
// }

let browser = await puppeteer.connect()
let page = await browser.newPage()