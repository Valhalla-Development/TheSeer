import type { ArgsOf, Client } from 'discordx';
import { Discord, On } from 'discordx';
import chalk from 'chalk';
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
            chalk.white.bold('New guild joined:'),
            chalk.red.bold(guild.name),
            chalk.white.bold('(id:'),
            chalk.red.bold(guild.id),
            chalk.white.bold(')'),
            chalk.red.bold(guild.memberCount),
            chalk.white.bold('members.'),
        );

        await updateActivity(client, WatchedBots);
    }
}
