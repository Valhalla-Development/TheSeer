import type {
    ButtonInteraction, CommandInteraction, EmbedBuilder, Interaction, Message,
} from 'discord.js';
import {
    ActionRowBuilder, ActivityType, ButtonBuilder, ButtonStyle,
} from 'discord.js';
import mongoose from 'mongoose';
import '@colors/colors';
import type { Client } from 'discordx';
import WatchedBots from '../mongo/schemas/WatchedBots.js';

/**
 * Capitalises the first letter of each word in a string.
 * @param str - The string to be capitalised.
 * @returns The capitalised string.
 */
export const capitalise = (str: string): string => str.replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Deletes a message after a specified delay if it's deletable.
 * @param message - The message to delete.
 * @param time - The delay before deletion, in milliseconds.
 */
export function deletableCheck(message: Message, time: number): void {
    setTimeout(() => {
        message.delete().catch((error) => console.error('Error deleting message:', error));
    }, time);
}

/**
 * Connects to the MongoDB database and sets up event listeners for the connection.
 * @returns A promise that resolves with void when the connection is established.
 */
export async function loadMongoEvents(): Promise<void> {
    try {
        await mongoose.connect(`${process.env.MongoUri}`);
        console.log('[Database Status]: Connected.'.green.bold);
    } catch (err) {
        console.error('[Database Status]: An error occurred with the Mongo connection:'.red.bold, `\n${err}`);
        throw err;
    }

    mongoose.connection.on('connecting', () => {
        console.log('[Database Status]: Connecting.'.cyan.bold);
    });

    mongoose.connection.on('connected', () => {
        console.log('[Database Status]: Connected.'.green.bold);
    });

    mongoose.connection.on('error', (err) => {
        console.error(
            '[Database Status]: An error occurred with the Mongo connection:'.red.bold,
            `\n${err}`,
        );
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

/**
 * Creates a pagination system for a list of embeds with next, back, and home buttons.
 * @param interaction - The interaction that triggered the pagination.
 * @param embeds - An array of EmbedBuilders to paginate.
 * @param emojiNext - The emoji to use for the next button. Defaults to '▶️'.
 * @param emojiHome - The emoji to use for the home button. Defaults to '🏠'.
 * @param emojiBack - The emoji to use for the back button. Defaults to '◀️'.
 * @returns A promise that resolves with void when the pagination is complete.
 */
export async function pagination(interaction: CommandInteraction, embeds: EmbedBuilder[], emojiNext: string, emojiHome: string, emojiBack: string) {
    const back = new ButtonBuilder()
        .setCustomId('back')
        .setEmoji(emojiBack)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true);

    const home = new ButtonBuilder()
        .setCustomId('home')
        .setEmoji(emojiHome)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true);

    const next = new ButtonBuilder()
        .setCustomId('next')
        .setEmoji(emojiNext)
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(back, home, next);

    const m = await interaction.reply({
        embeds: [embeds[0]],
        components: [row],
    });

    const filter = (i: Interaction) => {
        if (!i.isButton()) return false;
        const button = i as ButtonInteraction;
        return button.user.id === interaction.user.id;
    };

    const collector = m.createMessageComponentCollector({
        filter,
        time: 30000,
    });

    let currentPage = 0;

    collector.on('collect', async (b) => {
        collector.resetTimer();

        if (b.customId === 'back') {
            if (currentPage !== 0) {
                if (currentPage === embeds.length - 1) {
                    next.setDisabled(false);
                }

                currentPage -= 1;

                if (currentPage === 0) {
                    back.setDisabled(true);
                    home.setDisabled(true);
                }

                const rowNew = new ActionRowBuilder<ButtonBuilder>().addComponents(back, home, next);

                await b.update({
                    embeds: [embeds[currentPage]],
                    components: [rowNew],
                });
            }
        }

        if (b.customId === 'next') {
            if (currentPage < embeds.length - 1) {
                currentPage += 1;

                if (currentPage === embeds.length - 1) {
                    next.setDisabled(true);
                }

                home.setDisabled(false);
                back.setDisabled(false);

                const rowNew = new ActionRowBuilder<ButtonBuilder>().addComponents(back, home, next);

                await b.update({
                    embeds: [embeds[currentPage]],
                    components: [rowNew],
                });
            }
        }

        if (b.customId === 'home') {
            currentPage = 0;
            home.setDisabled(true);
            back.setDisabled(true);
            next.setDisabled(false);

            const rowNew = new ActionRowBuilder<ButtonBuilder>().addComponents(back, home, next);

            await b.update({ embeds: [embeds[currentPage]], components: [rowNew] });
        }
    });

    collector.on('end', () => {
        home.setDisabled(true);
        back.setDisabled(true);
        next.setDisabled(true);

        interaction.editReply({ embeds: [embeds[currentPage]], components: [row] });
    });

    collector.on('error', (e: Error) => console.log(e));
}

/**
 * Fetches all registered global application command IDs.
 * @param client - The Discord client instance.
 * @returns A record of command names to their corresponding IDs.
 */
export async function getCommandIds(client: Client): Promise<Record<string, string>> {
    try {
        const commands = await client.application?.commands.fetch();
        return commands ? Object.fromEntries(commands.map((c) => [c.name, c.id])) : {};
    } catch (error) {
        console.error('Error fetching global commands:', error);
        return {};
    }
}

/**
 * Applies a reversed rainbow effect to the input string.
 * @param str - The string to apply the reversed rainbow effect.
 * @returns The input string with reversed rainbow coloring.
 */
export const reversedRainbow = (str: string): string => {
    const colors = ['red', 'magenta', 'blue', 'green', 'yellow', 'red'] as const;
    return str
        .split('')
        .map((char, i) => char[colors[i % colors.length] as keyof typeof char])
        .join('');
};
