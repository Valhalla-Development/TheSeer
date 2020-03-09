const { RichEmbed } = require('discord.js');
const SQLite = require('better-sqlite3');
const { ownerid } = require('../../botconfig.json');
const { prefix } = require('../../botconfig.json');

const db = new SQLite('./db/db.sqlite');

module.exports = {
  config: {
    name: 'channel',
    description: 'sets the channel for the watchlist',
    usage: '!channel <#channel>',
    category: 'moderation',
    accessableby: 'Staff',
  },
  run: async (bot, message, args) => {
    if ((!message.member.hasPermission('MANAGE_GUILD') && (message.author.id !== ownerid))) {
      message.channel.send('You need the `MANAGE_SERVER` permission to use this command!').then((msg) => {
        msg.delete(10000);
      });
      return;
    }

    if (args[0] === undefined) {
      const noInput = new RichEmbed()
        .setColor('8e2430')
        .setDescription(`Incorrect usage! Correct usage: \`${prefix}channel <#channel>\``);
      message.channel.send(noInput);
      return;
    }

    const lchan = message.mentions.channels.first();

    if (!lchan) {
      const notaBot = new RichEmbed()
        .setColor('8e2430')
        .setDescription('You need to tag a channel!');
      message.channel.send(notaBot).then((msg) => {
        msg.delete(10000);
      });
    } else {
      const checkExists = db.prepare(`SELECT chanid FROM watchedbots WHERE (guildid) = (${message.guild.id});`).get();
      if (checkExists) {
        const alreadyMonit = new RichEmbed()
          .setColor('8e2430')
          .setDescription(`${lchan} has been set as the alert channel! :slight_smile:`);
        message.channel.send(alreadyMonit).then((msg) => {
          msg.delete(10000);
        });
        const insert = db.prepare('UPDATE watchedbots SET chanid = (@chanid) WHERE guildid = (@guildid);');
        insert.run({
          guildid: `${message.guild.id}`,
          chanid: `${lchan.id}`,
        });
      } else {
        const success = new RichEmbed()
          .setColor('8e2430')
          .setDescription(`${lchan} has been set as the alert channel! :slight_smile:`);
        message.channel.send(success).then((msg) => {
          msg.delete(20000);
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
