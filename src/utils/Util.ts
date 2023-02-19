import type { Message } from 'discord.js';
import mongoose from 'mongoose';
import chalk from 'chalk';

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
    mongoose.set('strictQuery', false);

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
