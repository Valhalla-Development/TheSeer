import type { ArgsOf, Client } from 'discordx';
import { Discord, On } from 'discordx';
import 'colors';
import WatchedBots from '../mongo/schemas/WatchedBots.js';
import { updateActivity } from '../utils/Util.js';

@Discord()
export class GuildCreate {
    /**
     * Handles the 'guildCreate' event, which is triggered when the bot is added to a guild.
     * @param args - An array containing the guild that was created.
     * @param client - The Discord client.
     */
    @On({ event: 'guildCreate' })
    async onGuildCreate([guild]: ArgsOf<'guildCreate'>, client: Client) {
        console.log(
            'New guild joined:'.white.bold,
            `${guild.name}`.red.bold,
            '(id:'.white.bold,
            `${guild.id}`.red.bold,
            ')'.white.bold,
            `${guild.memberCount}`.red.bold,
            'members.'.white.bold,
        );

        await updateActivity(client, WatchedBots);
    }
}
