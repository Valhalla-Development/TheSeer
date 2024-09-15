import type { ArgsOf, Client } from 'discordx';
import { Discord, On } from 'discordx';
import { ChannelType, codeBlock, EmbedBuilder } from 'discord.js';
import moment from 'moment';
import '@colors/colors';
import { reversedRainbow } from '../utils/Util.js';

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
            || (!interaction.isStringSelectMenu() && !interaction.isChatInputCommand() && !interaction.isContextMenuCommand())) return;

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
            const executedCommand = interaction.toString();

            // Add fields to the log embed with information about the executed command
            logEmbed.addFields({
                name: `Guild: ${interaction.guild.name} | Date: <t:${nowInSecond}>`,
                value: codeBlock('kotlin', `'${interaction.toString()}' Command was executed by ${interaction.user.tag}`),
            });

            // Log the command execution in the console
            console.log(
                `${'◆◆◆◆◆◆'.rainbow.bold} ${moment().format('MMM D, h:mm A')} ${reversedRainbow('◆◆◆◆◆◆')}\n`
                + `${'🔧 Command:'.brightBlue.bold} ${executedCommand.brightYellow.bold}\n${
                    `${'🔍 Executor:'.brightBlue.bold} ${interaction.user.displayName.underline.brightMagenta.bold} ${'('.gray.bold}${'Guild: '.brightBlue.bold}${interaction.guild.name.underline.brightMagenta.bold}`.brightBlue.bold}${')'.gray.bold}\n`,
            );

            // Send the log embed to the designated command logging channel, if specified
            if (process.env.CommandLogging) {
                const channel = client.channels.cache.get(process.env.CommandLogging);
                if (channel && channel.type === ChannelType.GuildText) channel.send({ embeds: [logEmbed] });
            }
        }
    }
}
