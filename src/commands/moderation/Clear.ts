import type { Client } from 'discordx';
import { Discord, Slash } from 'discordx';
import type { CommandInteraction } from 'discord.js';
import { EmbedBuilder, PermissionsBitField } from 'discord.js';
import { Category } from '@discordx/utilities';
import WatchedBots from '../../mongo/schemas/WatchedBots.js';
import { updateActivity } from '../../utils/Util.js';

@Discord()
@Category('Moderation')
export class Clear {
    @Slash({ description: 'Disables monitoring', defaultMemberPermissions: [PermissionsBitField.Flags.ManageGuild] })
    async clear(interaction: CommandInteraction, client: Client) {
        if (!interaction.channel) return;

        const status = await WatchedBots.findOne({ GuildId: interaction.guild?.id });

        if (!status) {
            const embed = new EmbedBuilder()
                .setColor('#e91e63')
                .addFields({
                    name: `**${client.user?.username} - Clear**`,
                    value: `**◎ Error:** ${client.user} is not enabled in this server.`,
                });
            await interaction.reply({ ephemeral: true, embeds: [embed] });
            return;
        }

        WatchedBots.deleteOne({ GuildId: interaction.guild?.id })
            .then((result) => console.log(result))
            .catch((error) => console.log(error));

        const embed = new EmbedBuilder()
            .setColor('#e91e63')
            .addFields({
                name: `**${client.user?.username} - Clear**`,
                value: `**◎ Success:** ${client.user} has been disabled in this server.`,
            });
        await interaction.reply({ ephemeral: true, embeds: [embed] });

        await updateActivity(client, WatchedBots);
    }
}
