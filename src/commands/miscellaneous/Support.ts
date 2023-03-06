import type { Client } from 'discordx';
import { Discord, Slash } from 'discordx';
import type { CommandInteraction } from 'discord.js';
import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder,
} from 'discord.js';
import { Category } from '@discordx/utilities';

@Discord()
@Category('Miscellaneous')
export class Support {
    /**
     * Displays support information for the bot.
     * @param interaction - The command interaction.
     * @param client - The Discord client.
     */
    @Slash({ description: 'Displays an invite link to the bots support server.' })
    async support(interaction: CommandInteraction, client: Client) {
        if (!interaction.channel) return;

        const embed = new EmbedBuilder()
            .setColor('#e91e63')
            .addFields({ name: `**${client.user?.username} - Support**`, value: 'Need support?' });

        const buttonA = new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Join Guild').setURL('https://discord.gg/Q3ZhdRJ');

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttonA);
        await interaction.reply({ components: [row], embeds: [embed] });
    }
}
