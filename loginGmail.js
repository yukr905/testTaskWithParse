import puppeteer  from "puppeteer-extra"
import pluginStealth from 'puppeteer-extra-plugin-stealth'

puppeteer.use(pluginStealth())

const email = "" // email
const password = "" // password

async function loginGmail(){
    try{
    const browser = await puppeteer.launch({headless:false , defaultViewport: false})
    const page = await browser.newPage()
    const pages = await browser.pages()
    pages[0].close()

    await page.goto("https://mail.google.com/", {waitUntil:"load"})
    await page.type('input[type="email"]', `${email}`,{delay:300})
    await page.click("#identifierNext")
    await page.waitForSelector("#password")
    await page.waitForTimeout(4000)
    await page.type('input[type="password"]',password,{delay:200})
    await page.click("#passwordNext")
    await page.waitForTimeout(2000)
    await page.goto('https://mail.google.com/mail/u/0/#advanced-search/is_unread=true&isrefinement=true', {waitUntil:"load"})

    async function getUnreadEmails(){
        const emails = await page.evaluate(() => {
            let emailsList = []
            const emailElements = document.querySelectorAll('div[role="checkbox"')
            for(let element of emailElements){
                let unread = element.getAttribute("aria-checked") === "false"
                if(unread){
                    emailsList.push(element)
                }
            }
            return emailsList
        })
        return emails
    }

    let allEmails = []
    await page.waitForSelector('div[role="checkbox"]')
    while(true){
        let currentPage = await getUnreadEmails()
        if(currentPage.length < 50){
            allEmails = allEmails.concat(currentPage)
            break
        }
        allEmails = allEmails.concat(currentPage)
        await page.click('div[aria-label="Старіші"]')
        await page.waitForTimeout(3000)
    }
    console.log(allEmails.length)
    await browser.close()
    }catch(e){
        console.log(e)
    }

}


loginGmail()