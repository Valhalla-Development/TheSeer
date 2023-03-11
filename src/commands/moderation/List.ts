import type { Client } from 'discordx';
import { Discord, Slash } from 'discordx';
import type { CommandInteraction, User } from 'discord.js';
import { EmbedBuilder, PermissionsBitField } from 'discord.js';
import { Category } from '@discordx/utilities';
import WatchedBots from '../../mongo/schemas/WatchedBots.js';
import { pagination } from '../../utils/Util.js';

@Discord()
@Category('Moderation')
export class List {
    /**
     * Slash command to list watched bots.
     * @param interaction - The interaction triggering the command.
     * @param client - The Discord client.
     */
    @Slash({ description: 'List watched bots', defaultMemberPermissions: [PermissionsBitField.Flags.ManageGuild] })
    async list(interaction: CommandInteraction, client: Client) {
        if (!interaction.channel) return;

        const status = await WatchedBots.findOne({ GuildId: interaction.guild?.id });

        if (!status?.BotIds) {
            const embed = new EmbedBuilder()
                .setColor('#e91e63')
                .addFields({
                    name: `**${client.user?.username} - List**`,
                    value: `**◎ Error:** ${client.user} is not monitoring any bots.`,
                });
            await interaction.reply({ ephemeral: true, embeds: [embed] });
        }

        const fetchUser = (key: string) => client.users.fetch(key);
        const promises = status?.BotIds.map(fetchUser);
        const results = await Promise.allSettled(promises || []);

        const arr = results
            .filter((result): result is PromiseFulfilledResult<User> => result.status === 'fulfilled')
            .map((result, index) => {
                const bot = result.value;
                return `\`${index + 1}\` ${bot} - (${bot.id})`;
            });

        const Embeds = [];
        const TotalPage = Math.ceil(arr.length / 5);
        let PageNo = 1;

        for (let i = 0; i < arr.length; i += 5) {
            const Embed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.avatarURL()}` })
                .setColor('#e91e63')
                .addFields({
                    name: `**${client.user?.username} - List**`,
                    value: `${arr.slice(i, i + 5).join('\n')}`,
                })
                .setFooter({ text: `${TotalPage > 1 ? `Page: ${PageNo}/${TotalPage}` : 'Page 1/1'}` });

            Embeds.push(Embed);
            PageNo += 1;
        }

        (TotalPage > 1 ? await pagination(interaction, Embeds, '▶️', '🏠', '◀️') : await interaction.reply({ embeds: [Embeds[0]] }));
    }
}
