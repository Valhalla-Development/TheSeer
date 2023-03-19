import { Client, ContextMenu, Discord } from 'discordx';
import { ApplicationCommandType, EmbedBuilder, UserContextMenuCommandInteraction } from 'discord.js';
import WatchedBots from '../mongo/schemas/WatchedBots.js';
import { updateActivity } from '../utils/Util.js';

@Discord()
export class AddContext {
    /**
     * Adds a bot to the watchlist, similar to the command, but in context menu form
     * @param interaction - The command interaction
     * @param client - The Discord client.
     */

    @ContextMenu({
        name: 'Add to monitor list',
        type: ApplicationCommandType.User,
    })
    async userHandler(interaction: UserContextMenuCommandInteraction, client: Client): Promise<void> {
        if (interaction.targetUser.id === client.user?.id) {
            const embed = new EmbedBuilder()
                .setColor('#e91e63')
                .addFields({
                    name: `**${client.user?.username} - Add**`,
                    value: '**◎ Error:** I can not monitor myself.',
                });
            await interaction.reply({ ephemeral: true, embeds: [embed] });
            return;
        }

        if (!interaction.targetUser.bot) {
            const embed = new EmbedBuilder()
                .setColor('#e91e63')
                .addFields({
                    name: `**${client.user?.username} - Add**`,
                    value: '**◎ Error:** The target was not a bot.',
                });
            await interaction.reply({ ephemeral: true, embeds: [embed] });
            return;
        }

        const status = await WatchedBots.findOne({ GuildId: interaction.guild?.id });

        const found = status?.BotIds ?? [];
        if (found.includes(interaction.targetUser.id)) {
            const embed = new EmbedBuilder()
                .setColor('#e91e63')
                .addFields({
                    name: `**${client.user?.username} - Add**`,
                    value: '**◎ Error:** The target is already being monitored.',
                });
            await interaction.reply({ ephemeral: true, embeds: [embed] });
        } else {
            found.push(interaction.targetUser.id);
            await WatchedBots.findOneAndUpdate({ GuildId: interaction.guild?.id }, { BotIds: found }, {
                new: true,
                upsert: true,
            });

            const embed = new EmbedBuilder()
                .setColor('#e91e63')
                .addFields({
                    name: `**${client.user?.username} - Channel**`,
                    value: `**◎ Success:** Target ${interaction.targetUser} is now being monitored.
                    If you have not set a channel, or enabled DM alerts. Please do so now.`,
                });
            await interaction.reply({ ephemeral: true, embeds: [embed] });

            await updateActivity(client, WatchedBots);
        }
    }
}
