import type { ArgsOf, Client } from 'discordx';
import { Discord, On } from 'discordx';
import { ChannelType, codeBlock, EmbedBuilder } from 'discord.js';
import moment from 'moment';

@Discord()
export class InteractionCreate {
    /**
     * Handler for interactionCreate event.
     * @param args - An array containing the interaction and client objects.
     * @param client - The Discord client.
     */
    @On({ event: 'interactionCreate' })
    async onInteraction([interaction]: ArgsOf<'interactionCreate'>, client: Client) {
        // Check if the interaction is in a guild and in a guild text channel, and is either a string select menu or a chat input command.
        if (!interaction.guild || !interaction.channel || interaction.channel.type !== ChannelType.GuildText
            || (!interaction.isStringSelectMenu() && !interaction.isChatInputCommand())) return;

        try {
            await client.executeInteraction(interaction);
        } catch (err) {
            console.error(err);
        }

        // Logging
        if (process.env.Logging && process.env.Logging.toLowerCase() === 'true') {
            if (!interaction.isChatInputCommand()) return;

            const nowInMs = Date.now();
            const nowInSecond = Math.round(nowInMs / 1000);

            const logEmbed = new EmbedBuilder().setColor('#e91e63');

            // Add fields to the log embed with information about the executed command
            logEmbed.addFields({
                name: `Guild: ${interaction.guild.name} | Date: <t:${nowInSecond}>`,
                value: codeBlock('kotlin', `'${interaction.toString()}' Command was executed by ${interaction.user.tag}`),
            });
            // Log the command execution in the console
            const LoggingNoArgs = `[\x1b[31m${moment().format(
                'LLLL',
            )}\x1b[0m] '\x1b[92m${interaction.toString()}\x1b[0m' Command was executed by \x1b[31m${interaction.user.tag}\x1b[0m (Guild: \x1b[31m${
                interaction.guild.name
            }\x1b[0m)`;
            console.log(LoggingNoArgs);

            // Send the log embed to the designated command logging channel, if specified
            if (process.env.CommandLogging) {
                const channel = client.channels.cache.get(process.env.CommandLogging);
                if (channel && channel.type === ChannelType.GuildText) channel.send({ embeds: [logEmbed] });
            }
        }
    }
}
