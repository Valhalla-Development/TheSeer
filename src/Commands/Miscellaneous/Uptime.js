import { EmbedBuilder } from 'discord.js';
import Command from '../../Structures/Command.js';

export const CommandF = class extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Displays bot uptime.',
      category: 'Miscellaneous'
    });
  }

  async run(interaction) {
    const nowInMs = Date.now() - this.client.uptime;
    const nowInSecond = Math.round(nowInMs / 1000);

    const embed = new EmbedBuilder()
      .setColor(this.client.utils.color(interaction.guild.members.me.displayHexColor))
      .addFields({ name: `**${this.client.user.username} - Uptime**`, value: `**◎ My uptime is:** <t:${nowInSecond}:R>` });
    interaction.reply({ embeds: [embed] });
  }
};

export default CommandF;
