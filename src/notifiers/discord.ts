
import { Client } from "detritus-client-rest";
import { ShoeInfo } from "../extractSizes";

export interface DiscordNotifierSettings {
    kind: "discord",
    token: string,
    user_id?: string,
    channel_id?: string
}

export class DiscordNotifier {
    client: Client;
    id?: string;
    constructor(client: Client, id: string) {
        this.client = client;
        this.id = id;
    }

    static async setup(settings: DiscordNotifierSettings) {
        const client = new Client(settings.token);
        let id;
        if (settings.user_id) {
            const r = await client.createDm({recipientId: settings.user_id});
            id = r.id;
        } else {
            id = settings.channel_id;
        }
        return new DiscordNotifier(client, id);
    } 

    async notify(shoeInfo: ShoeInfo, message: string): Promise<void> {
        if (this.id) await this.client.createMessage(this.id, {
            embeds: [{
                title: `👟 ${shoeInfo.name} (${shoeInfo.colorway})`,
                description: `**${message}**`
            }]
        });
    }

}