
import { ShoeInfo } from "../extractSizes";
import { ConsoleNotifier, ConsoleNotifierSettings } from "./console";
import { DiscordNotifier, DiscordNotifierSettings } from "./discord";

export type NotifierSettings = DiscordNotifierSettings | ConsoleNotifierSettings;
export type Notifier = DiscordNotifier | ConsoleNotifier;

export async function createNotifier(settings: NotifierSettings) {
    switch (settings.kind) {
    case "discord":
        return DiscordNotifier.setup(settings);
    case "console":
        return new ConsoleNotifier();
    }
}

export function notify(notifiers: Array<Notifier>, shoe: ShoeInfo, message: string) {
    for (const notifier of notifiers) {
        notifier.notify(shoe, message);
    }
}