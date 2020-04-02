const { MessageEmbed } = require('discord.js');
const SQLite = require('better-sqlite3');
const { ownerid, prefix, color } = require('../../botconfig.json');

const db = new SQLite('./db/db.sqlite');

module.exports = {
  config: {
    name: 'add',
    description: 'adds a bot to the watchlist',
    usage: `${prefix}add <@bot>`,
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
        .setDescription(`Incorrect usage! Correct usage: \`${prefix}add <@bot>\``);
      message.channel.send(noInput).then((msg) => {
        msg.delete({ timeout: 10000 });
      });
      return;
    }

    const mentionBot = message.mentions.members.first();

    if (!mentionBot) {
      const noMention = new MessageEmbed()
        .setColor(color)
        .setDescription('You need to mention a bot!');
      message.channel.send(noMention).then((msg) => {
        msg.delete({ timeout: 10000 });
      });
      return;
    }

    if (mentionBot.id === '559113940919910406') {
      const notMe = new MessageEmbed()
        .setColor(color)
        .setDescription('I can not monitor myself! :slight_frown:');
      message.channel.send(notMe).then((msg) => {
        msg.delete({ timeout: 10000 });
      });
      return;
    }

    if (!mentionBot.user.bot) {
      const notaBot = new MessageEmbed()
        .setColor(color)
        .setDescription('The specified user was not a bot!');
      message.channel.send(notaBot).then((msg) => {
        msg.delete({ timeout: 10000 });
      });
      return;
    }

    const botList = [];
    const checkExists = db.prepare('SELECT * FROM watchedbots WHERE guildid = ?;').get(message.guild.id);
    if (checkExists) {
      if (checkExists.botid) {
        const foundBotList = JSON.parse(checkExists.botid);
        if (foundBotList.includes(mentionBot.id)) {
          const alreadyMonit = new MessageEmbed()
            .setColor(color)
            .setDescription(`<@${mentionBot.id}> is already being monitored!`);
          message.channel.send(alreadyMonit).then((msg) => {
            msg.delete({ timeout: 10000 });
          });
          return;
        }
        foundBotList.push(mentionBot.id);
        const update = db.prepare('UPDATE watchedbots SET botid = (@botid) WHERE guildid = (@guildid)');
        update.run({
          guildid: `${message.guild.id}`,
          botid: JSON.stringify(foundBotList),
        });
        const success = new MessageEmbed()
          .setColor(color)
          .setDescription(`<@${mentionBot.id}> is now being monitored :slight_smile:`);
        message.channel.send(success).then((msg) => {
          msg.delete({ timeout: 10000 });
        });
      } else {
        botList.push(mentionBot.id);
        const update = db.prepare('UPDATE watchedbots SET botid = (@botid) WHERE guildid = (@guildid)');
        update.run({
          guildid: `${message.guild.id}`,
          botid: JSON.stringify(botList),
        });
        const success = new MessageEmbed()
          .setColor(color)
          .setDescription(`<@${mentionBot.id}> is now being monitored :slight_smile:`);
        message.channel.send(success).then((msg) => {
          msg.delete({ timeout: 10000 });
        });
      }
    } else {
      botList.push(mentionBot.id);
      const insert = db.prepare('INSERT INTO watchedbots SET (guildid, botid) VALUES (@guildid, @botid)');
      insert.run({
        guildid: `${message.guild.id}`,
        botid: JSON.stringify(botList),
      });
      const success = new MessageEmbed()
        .setColor(color)
        .setDescription(`<@${mentionBot.id}> is now being monitored :slight_smile:`);
      message.channel.send(success).then((msg) => {
        msg.delete({ timeout: 10000 });
      });
    }
  },
};
