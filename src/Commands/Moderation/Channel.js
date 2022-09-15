import { EmbedBuilder, SlashCommandBuilder, ChannelType, PermissionsBitField } from 'discord.js';
import SQLite from 'better-sqlite3';
import Command from '../../Structures/Command.js';

const db = new SQLite('./Storage/DB/db.sqlite');

const data = new SlashCommandBuilder()
  .setName('channel')
  .setDescription('Sets the alert channel')
  .addChannelOption((option) => option.setName('channel').setDescription('The bot you wish alerts to be sent to').setRequired(true));

export const CommandF = class extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Sets the alert channel',
      category: 'Moderation',
      userPerms: ['ManageGuild'],
      options: data
    });
  }

  async run(interaction) {
    const fetchDb = db.prepare('SELECT * FROM watchedbots WHERE guildid = ?;').get(interaction.guild.id);

    const channel = interaction.options.getChannel('channel');

    if (channel.type !== ChannelType.GuildText) {
      const embed = new EmbedBuilder().setColor(this.client.utils.color(interaction.guild.members.me.displayHexColor)).addFields({
        name: `**${this.client.user.username} - Channel**`,
        value: '**◎ Error:** Please enter a valid **text** channel.'
      });
      interaction.reply({ ephemeral: true, embeds: [embed] });
      return;
    }

    if (!interaction.guild.members.me.permissionsIn(channel).has(PermissionsBitField.Flags.SendMessages)) {
      const embed = new EmbedBuilder().setColor(this.client.utils.color(interaction.guild.members.me.displayHexColor)).addFields({
        name: `**${this.client.user.username} - Channel**`,
        value: `**◎ Error:** I do not have permissions to send messages in ${channel}!`
      });
      interaction.reply({ ephemeral: true, embeds: [embed] });
      return;
    }

    if (!fetchDb) {
      const insert = db.prepare('INSERT INTO watchedbots (guildid, chanid) VALUES (@guildid, @chanid);');
      insert.run({
        guildid: `${interaction.guild.id}`,
        chanid: `${channel.id}`
      });

      const embed = new EmbedBuilder().setColor(this.client.utils.color(interaction.guild.members.me.displayHexColor)).addFields({
        name: `**${this.client.user.username} - Channel**`,
        value: `**◎ Success:** Channel set to ${channel}`
      });
      interaction.reply({ ephemeral: true, embeds: [embed] });
    } else {
      const update = db.prepare('UPDATE watchedbots SET chanid = (@chanid) WHERE guildid = (@guildid)');
      update.run({
        guildid: `${interaction.guild.id}`,
        chanid: channel.id
      });

      const embed = new EmbedBuilder().setColor(this.client.utils.color(interaction.guild.members.me.displayHexColor)).addFields({
        name: `**${this.client.user.username} - Channel**`,
        value: `**◎ Success:** Channel updated to ${channel}`
      });
      interaction.reply({ ephemeral: true, embeds: [embed] });
    }
  }
};

export default CommandF;
