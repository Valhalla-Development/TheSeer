import { ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import Command from '../../Structures/Command.js';

export const CommandF = class extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Displays an invite link for the bot.',
      category: 'Miscellaneous'
    });
  }

  async run(interaction) {
    const embed = new EmbedBuilder()
      .setColor(this.client.utils.color(interaction.guild.members.me.displayHexColor))
      .addFields({ name: `**${this.client.user.username} - Invite**`, value: `Want to invite ${this.client.user}?` });

    const buttonA = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel('Invite')
      .setURL(`https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot%20applications.commands&permissions=1514550062326`);

    const row = new ActionRowBuilder().addComponents(buttonA);
    interaction.reply({ components: [row], embeds: [embed] });
  }
};

export default CommandF;
