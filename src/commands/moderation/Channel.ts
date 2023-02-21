import type { Client } from 'discordx';
import { Discord, Slash, SlashOption } from 'discordx';
import type { CommandInteraction } from 'discord.js';
import {
    ApplicationCommandOptionType, ChannelType, EmbedBuilder, PermissionsBitField, TextChannel,
} from 'discord.js';
import { Category } from '@discordx/utilities';
import WatchedBots from '../../mongo/schemas/WatchedBots.js';

@Discord()
@Category('Moderation')
export class Channel {
    @Slash({ description: 'Sets the alert channel', defaultMemberPermissions: [PermissionsBitField.Flags.ManageGuild] })
    async channel(
        @SlashOption({
            description: 'The channel alerts will be sent to',
            name: 'channel',
            required: true,
            type: ApplicationCommandOptionType.Channel,
        })
            channel: TextChannel,
            interaction: CommandInteraction,
            client: Client,
    ) {
        const status = await WatchedBots.findOne({ GuildId: interaction.guild?.id });

        if (!status || !status.BotIds) {
            const embed = new EmbedBuilder()
                .setColor('#e91e63')
                .addFields({
                    name: `**${client.user?.username} - Channel**`,
                    value: '**◎ Error:** Please use `/add @bot` before setting the channel.',
                });
            await interaction.reply({ ephemeral: true, embeds: [embed] });
            return;
        }

        if (channel.type !== ChannelType.GuildText) {
            const embed = new EmbedBuilder()
                .setColor('#e91e63')
                .addFields({
                    name: `**${client.user?.username} - Channel**`,
                    value: '**◎ Error:** Please enter a valid **text** channel.',
                });
            await interaction.reply({ ephemeral: true, embeds: [embed] });
            return;
        }

        if (!interaction.guild?.members.me?.permissionsIn(channel).has(PermissionsBitField.Flags.SendMessages)) {
            const embed = new EmbedBuilder()
                .setColor('#e91e63')
                .addFields({
                    name: `**${client.user?.username} - Channel**`,
                    value: `**◎ Error:** I do not have permissions to send messages in ${channel}!`,
                });
            await interaction.reply({ ephemeral: true, embeds: [embed] });
            return;
        }

        if (status && status.Channel === channel.id) {
            const embed = new EmbedBuilder()
                .setColor('#e91e63')
                .addFields({
                    name: `**${client.user?.username} - Channel**`,
                    value: `**◎ Error:** ${channel} is already set as the alert channel.`,
                });
            await interaction.reply({ ephemeral: true, embeds: [embed] });
        } else {
            await WatchedBots.findOneAndUpdate({ GuildId: interaction?.guild.id }, { Channel: channel.id });

            const embed = new EmbedBuilder()
                .setColor('#e91e63')
                .addFields({
                    name: `**${client.user?.username} - Channel**`,
                    value: `**◎ Success:** Alerts have been updated to ${channel}`,
                });
            await interaction.reply({ ephemeral: true, embeds: [embed] });
        }
    }
}
