import { EmbedBuilder } from 'discord.js';
import SQLite from 'better-sqlite3';
import Command from '../../Structures/Command.js';

const db = new SQLite('./Storage/DB/db.sqlite');

export const CommandF = class extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Enables DM monitoring',
      category: 'Moderation',
      userPerms: ['ManageGuild']
    });
  }

  async run(interaction) {
    const fetchDb = db.prepare('SELECT * FROM watchedbots WHERE guildid = ?;').get(interaction.guild.id);

    if (!fetchDb || !fetchDb.chanid) {
      const embed = new EmbedBuilder().setColor(this.client.utils.color(interaction.guild.members.me.displayHexColor)).addFields({
        name: `**${this.client.user.username} - DM**`,
        value: `**◎ Error:** ${this.client.user} is not enabled in this server.`
      });
      interaction.reply({ ephemeral: true, embeds: [embed] });
    } else {
      try {
        const embed = new EmbedBuilder().setColor(this.client.utils.color(interaction.guild.members.me.displayHexColor)).addFields({
          name: `**${this.client.user.username} - DM**`,
          value: `**◎ Success:** You will now receive monitoring reports from ${this.client.user}`
        });
        await interaction.user.send({ embeds: [embed] });

        await interaction.deferReply();
        interaction.deleteReply();

        const update = db.prepare('UPDATE watchedbots SET dmid = (@dmid) WHERE guildid = (@guildid);');
        update.run({
          guildid: `${interaction.guild.id}`,
          dmid: `${interaction.user.id}`
        });
      } catch {
        const embed = new EmbedBuilder().setColor(this.client.utils.color(interaction.guild.members.me.displayHexColor)).addFields({
          name: `**${this.client.user.username} - DM**`,
          value: `**◎ Error:** ${this.client.user} was unable to send you a DM, cancelling request.`
        });
        interaction.reply({ ephemeral: true, embeds: [embed] });
      }
    }
  }
};

export default CommandF;
