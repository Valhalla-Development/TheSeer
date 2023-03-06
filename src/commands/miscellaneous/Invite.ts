import type { Client } from 'discordx';
import { Discord, Slash } from 'discordx';
import type { CommandInteraction } from 'discord.js';
import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder,
} from 'discord.js';
import { Category } from '@discordx/utilities';

@Discord()
@Category('Miscellaneous')
export class Invite {
    /**
     * Displays an invitation link for the bot.
     * @param interaction - The command interaction.
     * @param client - The Discord client.
     */
    @Slash({ description: 'Displays an invite link for the bot.' })
    async invite(interaction: CommandInteraction, client: Client) {
        if (!interaction.channel) return;

        const embed = new EmbedBuilder()
            .setColor('#e91e63')
            .addFields({
                name: `**${client.user?.username} - Invite**`,
                value: `Want to invite ${client.user}?`,
            });

        const buttonA = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('Invite')
            .setURL(`https://discordapp.com/oauth2/authorize?client_id=${client.user?.id}&scope=bot%20applications.commands&permissions=414464724032`);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttonA);
        await interaction.reply({ components: [row], embeds: [embed] });
    }
}
