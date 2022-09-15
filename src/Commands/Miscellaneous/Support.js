import { ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import Command from '../../Structures/Command.js';

export const CommandF = class extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Displays an invite link to the bots support server.',
      category: 'Miscellaneous'
    });
  }

  async run(interaction) {
    const embed = new EmbedBuilder()
      .setColor(this.client.utils.color(interaction.guild.members.me.displayHexColor))
      .addFields({ name: `**${this.client.user.username} - Support**`, value: 'Need support?' });

    const buttonA = new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Join Guild').setURL('https://discord.gg/Q3ZhdRJ');

    const row = new ActionRowBuilder().addComponents(buttonA);
    interaction.reply({ components: [row], embeds: [embed] });
  }
};

export default CommandF;
