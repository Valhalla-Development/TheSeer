import type { Message } from 'discord.js';
import { ActivityType } from 'discord.js';
import mongoose from 'mongoose';
import 'colors';
import type { Client } from 'discordx';
import WatchedBots from '../mongo/schemas/WatchedBots.js';

/**
 * Checks if a message is deletable, and deletes it after a specified amount of time.
 * @param message - The message to check.
 * @param time - The amount of time to wait before deleting the message, in milliseconds.
 * @returns void
 */
export function deletableCheck(message: Message, time: number): void {
    setTimeout(() => {
        if (message && message.deletable) {
            message.delete().catch(console.error);
        }
    }, time);
}

/**
 * Capitalises the first letter of each word in a string.
 * @param string - The string to be capitalised.
 * @returns The capitalised string.
 */
export function capitalise(string: string) {
    return string.replace(/\S+/g, (word) => word.slice(0, 1).toUpperCase() + word.slice(1));
}

/**
 * Connects to the MongoDB database and sets up event listeners for the connection.
 * @returns A promise that resolves with void when the connection is established.
 */
export async function loadMongoEvents(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
        mongoose.connect(`${process.env.MongoUri}`)
            .then(() => {
                console.log('[Database Status]: Connected.'.green.bold);
                resolve();
            })
            .catch((err) => {
                console.error(`[Database Status]: An error occurred with the Mongo connection:\n${err}`.red.bold);
                reject();
            });
    });

    mongoose.connection.on('connecting', () => {
        console.log('[Database Status]: Connecting.'.cyan.bold);
    });

    mongoose.connection.on('connected', () => {
        console.log('[Database Status]: Connected.'.green.bold);
    });

    mongoose.connection.on('error', (err) => {
        console.error(`[Database Status]: An error occurred with the Mongo connection:\n${err}`.red.bold);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('[Database Status]: Disconnected'.red.bold);
    });
}

/**
 * Updates the activity of the bot user with the number of watched bots and guilds.
 * @param client - The Discord client.
 * @param db - The MongoDB model for the watched bots.
 * @returns A promise that resolves with void when the activity is updated.
 */
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
