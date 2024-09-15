import type { ArgsOf, Client } from 'discordx';
import { Discord, On } from 'discordx';
import '@colors/colors';
import WatchedBots from '../mongo/schemas/WatchedBots.js';
import { updateActivity } from '../utils/Util.js';

@Discord()
export class GuildDelete {
    /**
     * Handles the 'guildDelete' event, which is triggered when the bot is removed from a guild.
     * @param args - An array containing the guild that was deleted.
     * @param client - The Discord client.
     */
    @On({ event: 'guildDelete' })
    async onGuildDelete([guild]: ArgsOf<'guildDelete'>, client: Client) {
        console.log(
            'I have been removed from:'.white.bold,
            `${guild.name}`.red.bold,
            '(id:'.white.bold,
            `${guild.id}`.red.bold,
            ')'.white.bold,
        );

        await updateActivity(client, WatchedBots);

        WatchedBots.deleteOne({ GuildId: guild.id });
    }
}
