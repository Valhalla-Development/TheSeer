import { EmbedBuilder } from 'discord.js';
import SQLite from 'better-sqlite3';
import Command from '../../Structures/Command.js';

const db = new SQLite('./Storage/DB/db.sqlite');

export const CommandF = class extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Disables monitoring',
      category: 'Moderation',
      userPerms: ['ManageGuild']
    });
  }

  async run(interaction) {
    const fetchDb = db.prepare('SELECT * FROM watchedbots WHERE guildid = ?;').get(interaction.guild.id);

    if (!fetchDb) {
      const embed = new EmbedBuilder().setColor(this.client.utils.color(interaction.guild.members.me.displayHexColor)).addFields({
        name: `**${this.client.user.username} - Clear**`,
        value: `**◎ Error:** ${this.client.user} is not enabled in this server.`
      });
      interaction.reply({ ephemeral: true, embeds: [embed] });
    } else {
      db.prepare('DELETE FROM watchedbots WHERE guildid = ?').run(interaction.guild.id);

      const embed = new EmbedBuilder().setColor(this.client.utils.color(interaction.guild.members.me.displayHexColor)).addFields({
        name: `**${this.client.user.username} - Channel**`,
        value: `**◎ Success:** ${this.client.user} has been disabled in this server.`
      });
      interaction.reply({ ephemeral: true, embeds: [embed] });
    }
  }
};

export default CommandF;
