import type { Message } from 'discord.js';
import { ActivityType } from 'discord.js';
import mongoose from 'mongoose';
import chalk from 'chalk';
import type { Client } from 'discordx';
import WatchedBots from '../mongo/schemas/WatchedBots.js';

export function deletableCheck(message: Message, time: number): void {
    setTimeout(() => {
        if (message && message.deletable) {
            message.delete().catch(console.error);
        }
    }, time);
}

export function capitalise(string: string) {
    return string.replace(/\S+/g, (word) => word.slice(0, 1).toUpperCase() + word.slice(1));
}

export async function loadMongoEvents(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
        mongoose.connect(`${process.env.MongoUri}`)
            .then(() => {
                console.log(chalk.green.bold('[Database Status]: Connected.'));
                resolve();
            })
            .catch((err) => {
                console.error(chalk.red.bold(`[Database Status]: An error occurred with the Mongo connection:\n${err}`));
                reject();
            });
    });

    mongoose.connection.on('connecting', () => {
        console.log(chalk.cyan.bold('[Database Status]: Connecting.'));
    });

    mongoose.connection.on('connected', () => {
        console.log(chalk.green.bold('[Database Status]: Connected.'));
    });

    mongoose.connection.on('error', (err) => {
        console.error(chalk.red.bold(`[Database Status]: An error occurred with the Mongo connection:\n${err}`));
    });

    mongoose.connection.on('disconnected', () => {
        console.log(chalk.red.bold('[Database Status]: Disconnected'));
    });
}

export async function updateActivity(client: Client, db: typeof WatchedBots) {
    const pipeline = db.aggregate();
    pipeline.group({ _id: null, total: { $sum: { $size: { $ifNull: ['$BotIds', []] } } } });
    pipeline.project({ _id: 0, total: { $sum: ['$total', 0] } });
    pipeline.project({ total: { $ifNull: ['$total', 0] } });
    const result = await pipeline;

    const count = result.length === 0 ? 0 : result[0].total;

    client.user?.setActivity(`${count.toLocaleString('en')} Bots Across ${client.guilds.cache.size.toLocaleString('en')} Guilds`, {
        type: ActivityType.Watching,
    });
}
