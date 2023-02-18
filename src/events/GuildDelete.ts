import type { ArgsOf, Client } from 'discordx';
import { Discord, On } from 'discordx';
import { ActivityType } from 'discord.js';
import chalk from 'chalk';

@Discord()
export class GuildDelete {
    @On({ event: 'guildDelete' })
    async onGuildDelete([guild]: ArgsOf<'guildDelete'>, client: Client) {
        console.log(
            chalk.white.bold('I have been removed from:'),
            chalk.red.bold(guild.name),
            chalk.white.bold('(id:'),
            chalk.red.bold(guild.id),
            chalk.white.bold(')'),
        );

        const count = 1;// TODO placeholder
        client.user?.setActivity(`${count.toLocaleString('en')} Bots Across ${client.guilds.cache.size.toLocaleString('en')} Guilds`, {
            type: ActivityType.Watching,
        });

        // TODO Delete all from database
    }
}
