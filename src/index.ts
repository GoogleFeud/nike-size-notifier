
import Puppeteer, { Page } from "puppeteer";
import { extractShoeInfo, ShoeInfo } from "./extractSizes";
import { notify } from "./notifiers";
import { initOptions, Settings } from "./options";

async function check(options: Settings, page: Page, lastInfo?: ShoeInfo) {
    const shoeInfo = await extractShoeInfo(page, options.link);
    if (lastInfo) {
        if (lastInfo.sizes[options.size] && !shoeInfo.sizes[options.size]) {
            notify(options.notifiersInstances, shoeInfo, "No longer available!");
        } else if (!lastInfo.sizes[options.size] && shoeInfo.sizes[options.size]) {
            notify(options.notifiersInstances, shoeInfo, "Is now available!");
        } else {
            if (options.logOnCheck) notify(options.notifiersInstances, shoeInfo, "No new updates.");
        }
    } else {
        if (shoeInfo.sizes[options.size]) {
            notify(options.notifiersInstances, shoeInfo, "Is available!");
        } else {
            notify(options.notifiersInstances, shoeInfo, "Is not available.");
        }
    }
    setTimeout(() => {
        check(options, page, shoeInfo);
    }, options.interval * 1000);
}

(async () => {
    const options = await initOptions();
    if (!options.link || !options.size) return;
    const browser = await Puppeteer.launch({headless: !options.head});
    const page = await browser.newPage();
    check(options, page);
})();