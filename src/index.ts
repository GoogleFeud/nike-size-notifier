
import Puppeteer from "puppeteer";
import parseArgs from "minimist";

interface ShoeInfo {
    name: string,
    colorway: string,
    sizes: Record<string, boolean>
}

let LAST_SHOE_INFO: ShoeInfo|undefined;

(async () => {
    const options = parseArgs(process.argv.slice(2)) as {
        _: Array<string>,
        size: number,
        // In seconds
        interval?: number
    };
    const link = options._[0];
    if (!link || !options.size) return;
    const browser = await Puppeteer.launch();
    const page = await browser.newPage();
    setInterval(async () => {
        await page.goto(link);
        await page.waitForSelector("#buyTools > div:nth-child(1) > fieldset > div > div");
        const shoeInfo = JSON.parse(await page.evaluate(() => {
            const possibleColorways = ([...document.querySelectorAll("#ColorwayDiv > div > div > fieldset > div > div")] as HTMLDivElement[]).find(group => (group.children[0] as HTMLInputElement).checked);
            const result: ShoeInfo = {
                name: document.querySelector("#pdp_product_title")?.textContent || "Unknown",
                colorway: ((possibleColorways?.children[1] as HTMLLabelElement).children[0] as HTMLImageElement).alt || "Unknown",
                sizes: {}
            };
            const sizes = document.querySelectorAll("#buyTools > div:nth-child(1) > fieldset > div > div");
            for (const size of sizes) {
                const input = size.children[0] as HTMLInputElement;
                const label = size.children[1] as HTMLLabelElement;
                const sizeStr = size.textContent?.split(" ")[1];
                if (!label || !label || !sizeStr) continue;
                result.sizes[sizeStr] = !input.disabled;
            }
            return JSON.stringify(result);
        })) as ShoeInfo;
        if (LAST_SHOE_INFO && !LAST_SHOE_INFO.sizes[options.size.toString()] && shoeInfo.sizes[options.size.toString()]) {
            console.log(`!!!SIZE UPDATE!!!\nShoe: ${LAST_SHOE_INFO.name}\nColorway: ${LAST_SHOE_INFO.colorway}\nYour size is now available!`);
        } else {
            console.log("Shoe info updated, your size is not available.");
        }
        LAST_SHOE_INFO = shoeInfo;
    }, options.interval ? options.interval * 1000 : 60_000);
})();