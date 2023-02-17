import type { ArgsOf, Client } from 'discordx';
import { Discord, On } from 'discordx';
import { ActivityType } from 'discord.js';
import chalk from 'chalk';

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

        const count = 1;//! placeholder
        client.user?.setActivity(`${count.toLocaleString('en')} Bots Across ${client.guilds.cache.size.toLocaleString('en')} Guilds`, {
            type: ActivityType.Watching,
        });
    }
}
