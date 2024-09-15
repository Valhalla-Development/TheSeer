import type { Client } from 'discordx';
import { Discord, Once } from 'discordx';
import si from 'systeminformation';
import { version } from 'discord.js';
import WatchedBots from '../mongo/schemas/WatchedBots.js';
import { updateActivity } from '../utils/Util.js';
import '@colors/colors';

/**
 * Discord.js Ready event handler.
 */
@Discord()
export class Ready {
    /**
     * Executes when the ready event is emitted.
     * @param client - The Discord client.
     * @returns void
     */
    @Once({ event: 'ready' })
    async onReady([client]: [Client]) {
        // Init slash commands
        await client.initApplicationCommands();

        // Fetch stats
        const memory = await si.mem();
        const totalMemory = Math.floor(memory.total / 1024 / 1024);
        const cachedMem = memory.buffcache / 1024 / 1024;
        const memoryUsed = memory.used / 1024 / 1024;
        const realMemUsed = Math.floor(memoryUsed - cachedMem);

        // Bot Info
        console.log(
            '\n',
            `——————————[${client.user?.username} Info]——————————`.red.bold,
        );
        console.log(
            'Users:'.white.bold,
            `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0).toLocaleString('en')}`.yellow.bold,
        );
        console.log(
            'Guilds:'.white.bold,
            `${client.guilds.cache.size.toLocaleString('en')}`.yellow.bold,
        );
        console.log(
            'Slash Commands:'.white.bold,
            `${client.applicationCommands.length}`.yellow.bold,
        );
        console.log(
            'Events:'.white.bold,
            `${client.events.length}`.yellow.bold,
        );
        console.log(
            'Invite:'.white.bold,
            `https://discordapp.com/oauth2/authorize?client_id=${client.user?.id}&scope=bot%20applications.commands&permissions=415306870006`.blue.underline.bold,
        );

        // Bot Specs
        console.log(
            '\n',
            `——————————[${client.user?.username} Specs]——————————`.red.bold,
        );
        console.log(
            'Running Node:'.white.bold,
            `${process.version}`.magenta.bold,
            'on'.white.bold,
            `${process.platform} ${process.arch}`.magenta.bold,
        );
        console.log(
            'Memory:'.white.bold,
            `${realMemUsed.toLocaleString('en')}`.yellow.bold,
            '/'.white.bold,
            `${totalMemory.toLocaleString('en')}`.yellow.bold,
            'MB'.white.bold,
        );
        console.log(
            'Discord.js Version:'.white.bold,
            `${version}`.green.bold,
        );
        console.log(
            `${client.user?.username} Version:`.white.bold,
            `${process.env.npm_package_version}`.green.bold,
            '\n',
        );

        await updateActivity(client, WatchedBots);

        // This exists due to a common issue with Discord API; since I don't updateActivity often,
        // Discord can *sometimes* reset the status to null
        setInterval(async () => {
            await updateActivity(client, WatchedBots);
        }, 6 * 60 * 60 * 1000);
    }
}
