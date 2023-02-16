import type { Client, ArgsOf } from 'discordx';
import { Discord, On } from 'discordx';

@Discord()
export class InteractionCreate {
    @On({ event: 'interactionCreate' })
    async onInteraction([interaction]: ArgsOf<"interactionCreate">, client: Client) {
        // Init slash commands
        await client.executeInteraction(interaction);
    }
}
