import type { Client } from 'discordx';
import { Discord, Slash } from 'discordx';
import type { CommandInteraction } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import { Category } from '@discordx/utilities';

@Discord()
@Category('Miscellaneous')
export class Uptime {
    @Slash({ description: 'Displays bot uptime.' })
    async uptime(interaction: CommandInteraction, client: Client) {
        if (!interaction.channel) return;

        // I suppose this is a 'hacky' solution, using: '(client.uptime ?? 0)`
        // but I can't really see why client.uptime would ever be 'null'
        // and I would rather not use a non-null assertion operator
        const nowInMs = Date.now() - (client.uptime ?? 0);
        const nowInSecond = Math.round(nowInMs / 1000);

        const embed = new EmbedBuilder()
            .setColor('#e91e63')
            .addFields({
                name: `**${client.user?.username} - Uptime**`,
                value: `**◎ My uptime is:** <t:${nowInSecond}:R>`,
            });
        await interaction.reply({ embeds: [embed] });
    }
}
