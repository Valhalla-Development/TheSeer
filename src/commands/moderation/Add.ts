import type { Client } from 'discordx';
import { Discord, Slash, SlashOption } from 'discordx';
import type { CommandInteraction, GuildMember } from 'discord.js';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { Category } from '@discordx/utilities';
import WatchedBots from '../../mongo/schemas/WatchedBots.js';

@Discord()
@Category('Moderation')
export class Add {
    @Slash({ description: 'Adds a bot to the watchlist' })
    async add(
        @SlashOption({
            description: 'The bot you wish to monitor',
            name: 'target',
            required: true,
            type: ApplicationCommandOptionType.User,
        })
            user: GuildMember,
            interaction: CommandInteraction,
            client: Client,
    ) {
        if (user.user.id === client.user?.id) {
            const embed = new EmbedBuilder().setColor('#e91e63').addFields({
                name: `**${client.user.username} - Add**`,
                value: '**◎ Error:** I can not monitor myself.',
            });
            await interaction.reply({ ephemeral: true, embeds: [embed] });
        }

        if (!user.user.bot) {
            const embed = new EmbedBuilder().setColor('#e91e63').addFields({
                name: `**${client.user?.username} - Add**`,
                value: '**◎ Error:** The target was not a bot.',
            });
            await interaction.reply({ ephemeral: true, embeds: [embed] });
        }

        const status = await WatchedBots.findOne({ GuildId: interaction.guild?.id });

        console.log(status);
        const found = status ? status.BotIds : [];
        if (found.includes(user.user.id)) {
            const embed = new EmbedBuilder().setColor('#e91e63').addFields({
                name: `**${client.user?.username} - Add**`,
                value: '**◎ Error:** The target is already being monitored.',
            });
            await interaction.reply({ ephemeral: true, embeds: [embed] });
        } else {
            found.push(user.user.id);
            await WatchedBots.findOneAndUpdate({ GuildId: interaction.guild?.id }, { BotIds: found }, {
                new: true,
                upsert: true,
            });
        }
    }
}
