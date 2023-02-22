import type { Client } from 'discordx';
import { Discord, Slash, SlashOption } from 'discordx';
import type { CommandInteraction, GuildMember } from 'discord.js';
import { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } from 'discord.js';
import { Category } from '@discordx/utilities';
import WatchedBots from '../../mongo/schemas/WatchedBots.js';
import { updateActivity } from '../../utils/Util.js';

@Discord()
@Category('Moderation')
export class Add {
    @Slash({
        description: 'Adds a bot to the watchlist',
        defaultMemberPermissions: [PermissionsBitField.Flags.ManageGuild],
    })
    async add(
        @SlashOption({
            description: 'The bot you wish to monitor',
            name: 'target',
            required: true,
            type: ApplicationCommandOptionType.User,
        })
            bot: GuildMember,
            interaction: CommandInteraction,
            client: Client,
    ) {
        if (bot.user.id === client.user?.id) {
            const embed = new EmbedBuilder()
                .setColor('#e91e63')
                .addFields({
                    name: `**${client.user?.username} - Add**`,
                    value: '**◎ Error:** I can not monitor myself.',
                });
            await interaction.reply({ ephemeral: true, embeds: [embed] });
            return;
        }

        if (!bot.user.bot) {
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
        if (found.includes(bot.user.id)) {
            const embed = new EmbedBuilder()
                .setColor('#e91e63')
                .addFields({
                    name: `**${client.user?.username} - Add**`,
                    value: '**◎ Error:** The target is already being monitored.',
                });
            await interaction.reply({ ephemeral: true, embeds: [embed] });
        } else {
            found.push(bot.user.id);
            await WatchedBots.findOneAndUpdate({ GuildId: interaction.guild?.id }, { BotIds: found }, {
                new: true,
                upsert: true,
            });

            const embed = new EmbedBuilder()
                .setColor('#e91e63')
                .addFields({
                    name: `**${client.user?.username} - Channel**`,
                    value: `**◎ Success:** Target ${bot} is now being monitored.`,
                });
            await interaction.reply({ ephemeral: true, embeds: [embed] });

            await updateActivity(client, WatchedBots);
        }
    }
}
