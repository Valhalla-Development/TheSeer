import type { ArgsOf, Client } from 'discordx';
import { Discord, On } from 'discordx';
import chalk from 'chalk';
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
            chalk.white.bold('I have been removed from:'),
            chalk.red.bold(guild.name),
            chalk.white.bold('(id:'),
            chalk.red.bold(guild.id),
            chalk.white.bold(')'),
        );

        await updateActivity(client, WatchedBots);

        WatchedBots.deleteOne({ GuildId: guild.id });
    }
}
