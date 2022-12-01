import { ShoeInfo } from "../extractSizes";

export class ConsoleNotifier {
    
    notify(shoeInfo: ShoeInfo, message: string): void {
        console.log(`Shoe: ${shoeInfo.name}\nColorway: ${shoeInfo.colorway}\n${message}`);
    }

}

export interface ConsoleNotifierSettings {
    kind: "console"
}