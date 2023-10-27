const puppeteer = require('puppeteer');
const BrowserObj = require('./browser')

const environment = "production"
const browserSettings = new BrowserObj.Browser(environment)

async function scrapeSummons(url) {
    try {
        console.log(`Starting scrape on the URL: ${url}`)
        /**
          Puppeteer old Headless deprecation warning:
        In the near feature `headless: true` will default to the new Headless mode
        for Chrome instead of the old Headless implementation. For more
        information, please see https://developer.chrome.com/articles/new-headless/.
        Consider opting in early by passing `headless: "new"` to `puppeteer.launch()`
        If you encounter any bugs, please report them to https://github.com/puppeteer/puppeteer/issues/new/choose.
        **/
        //Old code returning Promise object, cause to error mentioned before on local machine. 
        //Switched to getting actual data 
        let settings = await browserSettings.then(obj => obj)

        const browser = await puppeteer.launch(settings)
        const page = await browser.newPage();
        await page.goto(url)

        //No need to check out script object and JSON.parse it. Puppeteer already processed it
        let result = await page.evaluate(() => 
            window.__NEXT_DATA__);

        await browser.close();
        console.log(`Finishing scrape on the URL: ${url}`)
      
        return (result)
    }
    catch (error) {
        console.log(error)
    }
};
module.exports = {
    scrapeSummons,
};