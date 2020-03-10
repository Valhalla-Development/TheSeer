const { MessageEmbed } = require('discord.js');
const SQLite = require('better-sqlite3');
const { ownerid, prefix, color } = require('../../botconfig.json');

const db = new SQLite('./db/db.sqlite');

module.exports = {
  config: {
    name: 'channel',
    description: 'sets the channel for the watchlist',
    usage: `${prefix}channel <#channel>`,
    category: 'moderation',
    accessableby: 'Staff',
  },
  run: async (bot, message, args) => {
    if ((!message.member.hasPermission('MANAGE_GUILD') && (message.author.id !== ownerid))) {
      message.channel.send('You need the `MANAGE_SERVER` permission to use this command!').then((msg) => {
        msg.delete({ timeout: 10000 });
      });
      return;
    }

    if (!message.member.guild.me.hasPermission('EMBED_LINKS')) {
      message.channel.send('I need the permission `Embed Links` permission for this command!').then((msg) => {
        msg.delete({ timeout: 10000 });
      });
    }

    if (message.member.guild.me.hasPermission('MANAGE_MESSAGES')) {
      message.delete();
    }

    if (!args[0]) {
      const noInput = new MessageEmbed()
        .setColor(color)
        .setDescription(`Incorrect usage! Correct usage: \`${prefix}channel <#channel>\``);
      message.channel.send(noInput).then((msg) => {
        msg.delete({ timeout: 10000 });
      });
      return;
    }

    const lchan = message.mentions.channels.first();

    if (!lchan) {
      const notaBot = new MessageEmbed()
        .setColor(color)
        .setDescription('You need to tag a channel!');
      message.channel.send(notaBot).then((msg) => {
        msg.delete({ timeout: 10000 });
      });
    } else {
      const checkExists = db.prepare('SELECT chanid FROM watchedbots WHERE guildid = ?;').get(message.guild.id);
      if (checkExists) {
        const alreadyMonit = new MessageEmbed()
          .setColor(color)
          .setDescription(`${lchan} has been set as the alert channel! :slight_smile:`);
        message.channel.send(alreadyMonit).then((msg) => {
          msg.delete({ timeout: 10000 });
        });
        const insert = db.prepare('UPDATE watchedbots SET chanid = (@chanid) WHERE guildid = (@guildid);');
        insert.run({
          guildid: `${message.guild.id}`,
          chanid: `${lchan.id}`,
        });
      } else {
        const success = new MessageEmbed()
          .setColor(color)
          .setDescription(`${lchan} has been set as the alert channel! :slight_smile:`);
        message.channel.send(success).then((msg) => {
          msg.delete({ timeout: 10000 });
        });
        const insert = db.prepare('INSERT INTO watchedbots (guildid, chanid) VALUES (@guildid, @chanid);');
        insert.run({
          guildid: `${message.guild.id}`,
          chanid: `${lchan.id}`,
        });
      }
    }
  },
};
