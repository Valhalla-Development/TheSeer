import type { Client } from 'discordx';
import { ActivityType } from 'discord.js';
import { Discord, On } from 'discordx';
import si from 'systeminformation';
import chalk from 'chalk';

@Discord()
export class Ready {
    @On({ event: 'ready' })
    async onReady([client]: [Client]) {
        // Init slash commands
        await client.initApplicationCommands();

        // Bot Info
        console.log(chalk.red.bold(`\n——————————[${client.user?.username} Info]——————————`));
        console.log(chalk.white.bold('Users:'), chalk.yellow.bold(client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString('en')));
        console.log(chalk.white.bold('Guilds:'), chalk.yellow.bold(client.guilds.cache.size.toLocaleString('en')));
        console.log(chalk.white.bold('Slash Commands:'), chalk.yellow.bold(client.applicationCommands.length));
        console.log(chalk.white.bold('Events:'), chalk.yellow.bold(client.events.length));
        console.log(
            chalk.white.bold('Invite:'),
            chalk.blue.underline.bold(
                `https://discordapp.com/oauth2/authorize?client_id=${client.user?.id}&scope=bot%20applications.commands&permissions=415306870006`
            )
        );

        // Bot Specs
        console.log(chalk.red.bold(`\n——————————[${client.user?.username} Specs]——————————`));
        console.log(
            chalk.white.bold('Running Node:'),
            chalk.magenta.bold(`${process.version}`, chalk.white.bold('on'), chalk.magenta.bold(`${process.platform} ${process.arch}`))
        );

        const memory = await si.mem();
        const totalMemory = Math.floor(memory.total / 1024 / 1024);
        const cachedMem = memory.buffcache / 1024 / 1024;
        const memoryUsed = memory.used / 1024 / 1024;
        const realMemUsed = Math.floor(memoryUsed - cachedMem);

        console.log(
            chalk.white.bold('Memory:'),
            chalk.yellow.bold(realMemUsed.toLocaleString('en')),
            chalk.white.bold('/'),
            chalk.yellow.bold(totalMemory.toLocaleString('en')),
            chalk.white.bold('MB')
        );
        console.log(chalk.white.bold('Discord.js Version:'), chalk.green.bold(process.env.npm_package_dependencies_discord_js?.substring(1)));
        console.log(chalk.white.bold(`${client.user?.username} Version:`), chalk.green.bold(process.env.npm_package_version), '\n');

        // Watched Bots Table
        /* const watchedBots = db.prepare('SELECT count(*) FROM sqlite_master WHERE type=\'table\' AND name = \'watchedbots\';').get();
        if (!watchedBots['count(*)']) {
          console.log('Watched Bots Table Created!');
          db.prepare('CREATE TABLE watchedbots (guildid TEXT, botid TEXT, chanid TEXT, dmid TEXT);').run();
          db.prepare('CREATE UNIQUE INDEX idx_watchedbots_id ON watchedbots (guildid);').run();
          db.pragma('synchronous = 1');
          db.pragma('journal_mode = wal');
        } */

        // activity
        /* const activityGrab = db.prepare('SELECT botid FROM watchedbots').all();
        let count = 0;
        let dbdata;
        for (dbdata of activityGrab) {
          if (dbdata.botid) {
            const arr = dbdata.botid.slice(1, dbdata.botid.length - 1).split(',');
            count += arr.length;
          }
        } */
        const count = 1; // temp
        client.user?.setActivity(`${count.toLocaleString('en')} Bots Across ${client.guilds.cache.size.toLocaleString('en')} Guilds`, {
            type: ActivityType.Watching
        });
    }
}
