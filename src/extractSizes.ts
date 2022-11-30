import { Page } from "puppeteer";

export interface ShoeInfo {
    name: string,
    colorway: string,
    sizes: Record<string, boolean>
}

export async function extractShoeInfo(page: Page, link: string) : Promise<ShoeInfo> {
    await page.goto(link);
    await page.waitForSelector("#buyTools > div:nth-child(1) > fieldset > div > div");
    return JSON.parse(await page.evaluate(() => {
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
}