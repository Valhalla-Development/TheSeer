import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import SQLite from 'better-sqlite3';
import Command from '../../Structures/Command.js';

const db = new SQLite('./Storage/DB/db.sqlite');

const data = new SlashCommandBuilder()
  .setName('add')
  .setDescription('Adds a bot to the watchlist')
  .addUserOption((option) => option.setName('target').setDescription('The bot you wish to monitor').setRequired(true));

export const CommandF = class extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Adds a bot to the watchlist',
      category: 'Moderation',
      userPerms: ['ManageGuild'],
      options: data
    });
  }

  async run(interaction) {
    const fetchDb = db.prepare('SELECT * FROM watchedbots WHERE guildid = ?;').get(interaction.guild.id);

    const target = interaction.options.getUser('target');

    if (!fetchDb || (!fetchDb.chanid && fetchDb.dmid)) {
      // also do if it cant find the channel bub like it was deleted
      const embed = new EmbedBuilder().setColor(this.client.utils.color(interaction.guild.members.me.displayHexColor)).addFields({
        name: `**${this.client.user.username} - Add**`,
        value: '**◎ Error:** Please set a channel, or enable DM alerts before configuring the target.'
      });
      interaction.reply({ ephemeral: true, embeds: [embed] });
      return;
    }

    if (target.id === this.client.user.id) {
      const embed = new EmbedBuilder().setColor(this.client.utils.color(interaction.guild.members.me.displayHexColor)).addFields({
        name: `**${this.client.user.username} - Add**`,
        value: '**◎ Error:** I can not monitor myself.'
      });
      interaction.reply({ ephemeral: true, embeds: [embed] });
      return;
    }

    if (!target.bot) {
      const embed = new EmbedBuilder().setColor(this.client.utils.color(interaction.guild.members.me.displayHexColor)).addFields({
        name: `**${this.client.user.username} - Add**`,
        value: '**◎ Error:** The target was not a bot.'
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

    if (foundDb.includes(target.id)) {
      const embed = new EmbedBuilder().setColor(this.client.utils.color(interaction.guild.members.me.displayHexColor)).addFields({
        name: `**${this.client.user.username} - Add**`,
        value: '**◎ Error:** The target is already being monitored.'
      });
      interaction.reply({ ephemeral: true, embeds: [embed] });
    } else {
      foundDb.push(target.id);
      const update = db.prepare('UPDATE watchedbots SET botid = (@botid) WHERE guildid = (@guildid)');
      update.run({
        guildid: `${interaction.guild.id}`,
        botid: JSON.stringify(foundDb)
      });

      const embed = new EmbedBuilder().setColor(this.client.utils.color(interaction.guild.members.me.displayHexColor)).addFields({
        name: `**${this.client.user.username} - Add**`,
        value: '**◎ Success:** The target is now being monitored.'
      });
      interaction.reply({ ephemeral: true, embeds: [embed] });
    }
  }
};

export default CommandF;
