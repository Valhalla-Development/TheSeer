import type { Client } from 'discordx';
import { Discord, Slash, SlashOption } from 'discordx';
import type { CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } from 'discord.js';
import { Category } from '@discordx/utilities';
import WatchedBots from '../../mongo/schemas/WatchedBots';

@Discord()
@Category('Moderation')
export class Dm {
    @Slash({ description: 'Toggle the DM module', defaultMemberPermissions: [PermissionsBitField.Flags.ManageGuild] })
    async dm(
        @SlashOption({
            description: 'Toggle',
            name: 'toggle',
            required: true,
            type: ApplicationCommandOptionType.Boolean,
        })
            toggle: boolean,
            interaction: CommandInteraction,
            client: Client,
    ) {
        const status = await WatchedBots.findOne({ GuildId: interaction.guild?.id });

        if (!status || !status.BotIds) {
            const embed = new EmbedBuilder()
                .setColor('#e91e63')
                .addFields({
                    name: `**${client.user?.username} - Channel**`,
                    value: '**◎ Error:** Please use `/add @bot` before setting the DM module.',
                });
            await interaction.reply({ ephemeral: true, embeds: [embed] });
            return;
        }

        const response = status.Dm ? (toggle ? 'alreadyEnabled' : 'disabled') : (toggle ? 'enabled' : 'alreadyDisabled');

        if (response === 'enabled') {
            if (status.Dm) {
                const embed = new EmbedBuilder()
                    .setColor('#e91e63')
                    .addFields({
                        name: `**${client.user?.username} - DM**`,
                        value: '**◎ Error:** DM module already enabled.',
                    });
                await interaction.reply({ ephemeral: true, embeds: [embed] });
                return;
            }

            try {
                const embed = new EmbedBuilder()
                    .setColor('#e91e63')
                    .addFields({
                        name: `**${client.user?.username} - DM**`,
                        value: `**◎ Success:** You will now receive monitoring reports from ${client.user}`,
                    });
                await interaction.user.send({ embeds: [embed] });

                await interaction.deferReply();
                await interaction.deleteReply();

                await WatchedBots.findOneAndUpdate({ GuildId: interaction.guild?.id }, { Dm: true });
            } catch {
                const embed = new EmbedBuilder()
                    .setColor('#e91e63')
                    .addFields({
                        name: `**${client.user?.username} - DM**`,
                        value: `**◎ Error:** ${client.user} was unable to send you a DM, cancelling request.`,
                    });
                await interaction.reply({ ephemeral: true, embeds: [embed] });
            }
        } else if (response === 'disabled') {
            if (!status.Dm) {
                const embed = new EmbedBuilder()
                    .setColor('#e91e63')
                    .addFields({
                        name: `**${client.user?.username} - DM**`,
                        value: '**◎ Error:** DM module already disabled.',
                    });
                await interaction.reply({ ephemeral: true, embeds: [embed] });
                return;
            }

            await WatchedBots.findOneAndUpdate({ GuildId: interaction.guild?.id }, { Dm: false });

            const embed = new EmbedBuilder()
                .setColor('#e91e63')
                .addFields({
                    name: `**${client.user?.username} - Channel**`,
                    value: '**◎ Success:** DM module has disabled.',
                });
            await interaction.reply({ ephemeral: true, embeds: [embed] });
        }
    }
}
