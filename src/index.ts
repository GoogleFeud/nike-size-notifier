
import Puppeteer, { Page } from "puppeteer";
import { extractShoeInfo, ShoeInfo } from "./extractSizes";
import { initOptions } from "./options";

interface Settings {
    size: string,
    link: string,
    // In seconds
    interval: number,
    discord?: {
        id: string,
        token: string
    }
}

async function check(options: Settings, page: Page, lastInfo?: ShoeInfo) {
    const shoeInfo = await extractShoeInfo(page, options.link);
    if (lastInfo) {
        if (lastInfo.sizes[options.size] && !shoeInfo.sizes[options.size]) {
            console.log("Your size got taken!");
        } else if (!lastInfo.sizes[options.size] && shoeInfo.sizes[options.size]) {
            console.log("Your size has restocked!");
        } else {
            console.log("No new updates!");
        }
    } else {
        if (shoeInfo.sizes[options.size]) {
            console.log("They have your size! Go buy it now.");
        }
    }
    setTimeout(() => {
        check(options, page, shoeInfo);
    }, options.interval * 1000);
}

(async () => {
    const options = initOptions();
    console.log(options);
    if (!options.link || !options.size) return;
    const browser = await Puppeteer.launch();
    const page = await browser.newPage();
    check(options, page);
})();