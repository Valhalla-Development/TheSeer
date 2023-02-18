import type { ArgsOf, Client } from 'discordx';
import { Discord, On } from 'discordx';
import { ActivityType } from 'discord.js';

@Discord()
export class PresenceUpdate {
    @On({ event: 'presenceUpdate' })
    async onPresenceUpdate([oldPresence, newPresence]: ArgsOf<'presenceUpdate'>, client: Client) {
        // TODO
    }
}
