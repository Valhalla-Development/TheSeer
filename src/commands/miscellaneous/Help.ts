import type { Client } from 'discordx';
import {
    DApplicationCommand, Discord, MetadataStorage, SelectMenuComponent, Slash,
} from 'discordx';
import type { CommandInteraction, SelectMenuComponentOptionData, StringSelectMenuInteraction } from 'discord.js';
import { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder } from 'discord.js';
import { Category, ICategory } from '@discordx/utilities';
import { capitalise, deletableCheck } from '../../utils/Util.js';

@Discord()
@Category('Miscellaneous')
export class Help {
    @Slash({ description: 'Display list of commands.' })
    async help(interaction: CommandInteraction, client: Client) {
        if (!interaction.channel) return;

        const embed = new EmbedBuilder()
            .setColor('#e91e63')
            .setDescription(`Hey, I'm **__${client.user?.username}__**, a bot that monitors other bots!`)
            .setAuthor({ name: `${client.user?.username} Help`, iconURL: `${interaction.guild?.iconURL()}` })
            .setThumbnail(`${client.user?.displayAvatarURL()}`)
            .setFooter({
                text: `Bot Version ${process.env.npm_package_version}`,
                iconURL: `${client.user?.avatarURL()}`,
            });

        // This just filters all command categories where a: it exists and then b: removes duplicates
        const uniqueCategories = Array.from(new Set(
            MetadataStorage.instance.applicationCommands
                .filter((cmd: DApplicationCommand & ICategory) => cmd.category)
                .map((cmd: DApplicationCommand & ICategory) => cmd.category as string),
        ));

        // Now we want to create a new object for each category
        const cats: SelectMenuComponentOptionData[] = uniqueCategories.map((cat) => ({
            label: cat,
            value: `help-${cat.toLowerCase()}`,
        }));

        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('helpSelect')
                    .setPlaceholder('Nothing selected')
                    .addOptions(...cats),
            );

        // Send the initial message with the select menu
        await interaction.reply({ embeds: [embed], components: [row] });
    }

    @SelectMenuComponent({ id: 'helpSelect' })
    async handle(interaction: StringSelectMenuInteraction, client: Client): Promise<void> {
        // Receive value from select menu
        const value = interaction.values?.[0];

        // Return if no value
        if (!value.length) {
            return deletableCheck(interaction.message, 0);
        }

        // Search for category
        const selectedCategory = value.replace(/^help-/, '').toLowerCase();
        const filteredCommands = MetadataStorage.instance.applicationCommands.filter(
            (cmd: DApplicationCommand & ICategory) => cmd.category?.toLowerCase() === selectedCategory,
        );

        // Create an array of command names
        const commandNames = filteredCommands.map((cmd: DApplicationCommand & ICategory) => capitalise(cmd.name));

        const embed = new EmbedBuilder()
            .setColor('#e91e63')
            .setDescription(`Hey, I'm **__${client.user?.username}__**, a bot that monitors other bots!`)
            .setAuthor({ name: `${client.user?.username} Help`, iconURL: `${interaction.guild?.iconURL()}` })
            .setThumbnail(`${client.user?.displayAvatarURL()}`)
            .setFooter({
                text: `Bot Version ${process.env.npm_package_version}`,
                iconURL: `${client.user?.avatarURL()}`,
            })
            .addFields({
                name: `**Help - ${capitalise(selectedCategory)}**`,
                value: `\`${Array.from(commandNames).join('`, `')}\``,
            });

        await interaction.update({ embeds: [embed] });
    }
}
