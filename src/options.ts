import parseArgs from "minimist";
import fs from "fs";
import { createNotifier, NotifierSettings } from "./notifiers";
import { Notifier } from "./notifiers";

export interface Settings {
    size: string,
    link: string,
    // In seconds
    interval: number,
    logOnCheck?: boolean,
    head?: boolean,
    notifiers?: Array<NotifierSettings>,
    notifiersInstances: Array<Notifier>
}

export async function initOptions() {
    const cliArgs = parseArgs(process.argv.slice(2)) as {
        _: Array<string>
    } & Settings;
    const options: Settings = {
        size: "",
        link: "",
        interval: 60,
        notifiersInstances: []
    };
    if (cliArgs._[0]?.endsWith(".json")) Object.assign(options, JSON.parse(fs.readFileSync(cliArgs._[0], { encoding: "utf-8" })));
    Object.assign(options, cliArgs);
    if (!options.link) options.link = cliArgs._[0] || "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof options.size === "number") options.size = (options.size as any).toString();
    if (!options.notifiers) options.notifiersInstances = await Promise.all([createNotifier({kind: "console"})]);
    else options.notifiersInstances = await Promise.all(options.notifiers.map(n => createNotifier(n)));
    return options;
}