import { Client, ContextMenu, Discord } from 'discordx';
import { ApplicationCommandType, EmbedBuilder, UserContextMenuCommandInteraction } from 'discord.js';
import WatchedBots from '../mongo/schemas/WatchedBots.js';
import { updateActivity } from '../utils/Util.js';

@Discord()
export class RemoveContext {
    /**
     * Remove a bot to the watchlist, similar to the command, but in context menu form
     * @param interaction - The command interaction
     * @param client - The Discord client.
     */

    @ContextMenu({
        name: 'Remove from monitor list',
        type: ApplicationCommandType.User,
    })
    async userHandler(interaction: UserContextMenuCommandInteraction, client: Client): Promise<void> {
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

        if (!interaction.targetUser.bot) {
            const embed = new EmbedBuilder()
                .setColor('#e91e63')
                .addFields({
                    name: `**${client.user?.username} - Remove**`,
                    value: '**◎ Error:** The target was not a bot.',
                });
            await interaction.reply({ ephemeral: true, embeds: [embed] });
            return;
        }

        if (status.BotIds.includes(interaction.targetUser.id)) {
            const updatedBotIds = status.BotIds.filter((id) => id !== interaction.targetUser.id);
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
                    value: `**◎ Error:** ${interaction.targetUser} is not being monitored.`,
                });
            await interaction.reply({ ephemeral: true, embeds: [embed] });
        }
    }
}
