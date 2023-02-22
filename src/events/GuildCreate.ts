import type { ArgsOf, Client } from 'discordx';
import { Discord, On } from 'discordx';
import chalk from 'chalk';
import WatchedBots from '../mongo/schemas/WatchedBots.js';
import { updateActivity } from '../utils/Util.js';

@Discord()
export class GuildCreate {
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
