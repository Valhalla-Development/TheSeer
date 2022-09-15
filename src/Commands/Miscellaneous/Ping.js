import { EmbedBuilder } from 'discord.js';
import Command from '../../Structures/Command.js';

export const CommandF = class extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Displays bot and API ping.',
      category: 'Miscellaneous'
    });
  }

  async run(interaction) {
    const msg = await interaction.channel.send({ content: 'Pinging...' });

    const latency = msg.createdTimestamp - interaction.createdTimestamp;

    if (msg && msg.deletable) {
      msg.delete();
    }

    const embed = new EmbedBuilder().setColor(this.client.utils.color(interaction.guild.members.me.displayHexColor)).addFields([
      {
        name: `**${this.client.user.username} - Ping**`,
        value: `**◎ Bot Latency:** \`${latency}ms\`
				**◎ API Latency:** \`${Math.round(this.client.ws.ping)}ms\``
      }
    ]);

    interaction.reply({ embeds: [embed] });
  }
};

export default CommandF;
