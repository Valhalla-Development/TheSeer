import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import SQLite from 'better-sqlite3';
import Command from '../../Structures/Command.js';

const db = new SQLite('./Storage/DB/db.sqlite');

const data = new SlashCommandBuilder()
  .setName('remove')
  .setDescription('Removes a bot from the watchlist')
  .addUserOption((option) => option.setName('target').setDescription('The bot you wish to remove from the monitor').setRequired(true));

export const CommandF = class extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Removes a bot from the watchlist',
      category: 'Moderation',
      userPerms: ['ManageGuild'],
      options: data
    });
  }

  async run(interaction) {
    const fetchDb = db.prepare('SELECT * FROM watchedbots WHERE guildid = ?;').get(interaction.guild.id);

    const target = interaction.options.getUser('target');

    if (!fetchDb || !fetchDb.botid) {
      // also do if it cant find the channel bub like it was deleted
      const embed = new EmbedBuilder().setColor(this.client.utils.color(interaction.guild.members.me.displayHexColor)).addFields({
        name: `**${this.client.user.username} - Remove**`,
        value: `**◎ Error:** ${this.client.user} is not enabled on this server.`
      });
      interaction.reply({ ephemeral: true, embeds: [embed] });
      return;
    }

    let foundDb;

    if (!fetchDb || !fetchDb.botid) {
      foundDb = [];
    } else {
      foundDb = await JSON.parse(fetchDb.botid);
    }

    if (!foundDb.includes(target.id)) {
      const embed = new EmbedBuilder().setColor(this.client.utils.color(interaction.guild.members.me.displayHexColor)).addFields({
        name: `**${this.client.user.username} - Remove**`,
        value: '**◎ Error:** The target is not being monitored.'
      });
      interaction.reply({ ephemeral: true, embeds: [embed] });
    } else {
      const filtered = foundDb.filter((obj) => obj !== target.id);

      if (!filtered.length) {
        const update = db.prepare('UPDATE watchedbots SET botid = (@botid) WHERE guildid = (@guildid)');
        update.run({
          guildid: `${interaction.guild.id}`,
          botid: null
        });
      } else {
        const update = db.prepare('UPDATE watchedbots SET botid = (@botid) WHERE guildid = (@guildid)');
        update.run({
          guildid: `${interaction.guild.id}`,
          botid: JSON.stringify(filtered)
        });
      }

      console.log(foundDb.filter((obj) => obj !== target.id));
      const embed = new EmbedBuilder().setColor(this.client.utils.color(interaction.guild.members.me.displayHexColor)).addFields({
        name: `**${this.client.user.username} - Remove**`,
        value: '**◎ Success:** The target is no longer being monitored.'
      });
      interaction.reply({ ephemeral: true, embeds: [embed] });
    }
  }
};

export default CommandF;
