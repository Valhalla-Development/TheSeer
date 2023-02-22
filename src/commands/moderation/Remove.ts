import type { Client } from 'discordx';
import { Discord, Slash, SlashOption } from 'discordx';
import type { CommandInteraction, GuildMember } from 'discord.js';
import { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } from 'discord.js';
import { Category } from '@discordx/utilities';
import WatchedBots from '../../mongo/schemas/WatchedBots.js';
import { updateActivity } from '../../utils/Util.js';

@Discord()
@Category('Moderation')
export class Remove {
    @Slash({
        description: 'Removes a bot from the watchlist',
        defaultMemberPermissions: [PermissionsBitField.Flags.ManageGuild],
    })
    async remove(
        @SlashOption({
            description: 'The bot you wish to stop monitoring',
            name: 'target',
            required: true,
            type: ApplicationCommandOptionType.User,
        })
            bot: GuildMember,
            interaction: CommandInteraction,
            client: Client,
    ) {
        const status = await WatchedBots.findOne({ GuildId: interaction.guild?.id });

        if (!status || !status.BotIds) {
            const embed = new EmbedBuilder()
                .setColor('#e91e63')
                .addFields({
                    name: `**${client.user?.username} - Remove**`,
                    value: '**◎ Error:** No bots are being monitored.',
                });
            await interaction.reply({ ephemeral: true, embeds: [embed] });
            return;
        }

        if (!bot.user.bot) {
            const embed = new EmbedBuilder()
                .setColor('#e91e63')
                .addFields({
                    name: `**${client.user?.username} - Remove**`,
                    value: '**◎ Error:** The target was not a bot.',
                });
            await interaction.reply({ ephemeral: true, embeds: [embed] });
            return;
        }

        if (status.BotIds.includes(bot.user.id)) {
            const updatedBotIds = status.BotIds.filter((id) => id !== bot.user.id);
            await WatchedBots.findOneAndUpdate({ GuildId: interaction.guild?.id }, { BotIds: updatedBotIds.length ? updatedBotIds : null });

            const embed = new EmbedBuilder()
                .setColor('#e91e63')
                .addFields({
                    name: `**${client.user?.username} - Remove**`,
                    value: '**◎ Success:** The target is no longer being monitored.',
                });
            await interaction.reply({ ephemeral: true, embeds: [embed] });

            await updateActivity(client, WatchedBots);
        } else {
            const embed = new EmbedBuilder()
                .setColor('#e91e63')
                .addFields({
                    name: `**${client.user?.username} - Remove**`,
                    value: `**◎ Error:** ${bot} is not being monitored.`,
                });
            await interaction.reply({ ephemeral: true, embeds: [embed] });
        }
    }
}
