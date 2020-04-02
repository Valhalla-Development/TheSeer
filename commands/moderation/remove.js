/* eslint-disable no-undef */
const { MessageEmbed } = require('discord.js');
const SQLite = require('better-sqlite3');
const { prefix, ownerid, color } = require('../../botconfig.json');

const db = new SQLite('./db/db.sqlite');

module.exports = {
  config: {
    name: 'remove',
    description: 'remove a bot from the watchlist',
    usage: `${prefix}remove <@bot>`,
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

    if (!args[0]) {
      const noInput = new MessageEmbed()
        .setColor(color)
        .setDescription(`Incorrect usage! Correct usage: \`${prefix}remove <@bot>\``);
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
    const checkExists = db.prepare('SELECT * FROM watchedbots WHERE guildid = ?;').get(message.guild.id);
    if (!checkExists) {
      const noMonit = new MessageEmbed()
        .setColor(color)
        .setDescription('No bots are being monitored!');
      message.channel.send(noMonit).then((msg) => {
        msg.delete({ timeout: 10000 });
      });
      return;
    }
    if (checkExists.botid) {
      const foundBotList = JSON.parse(checkExists.botid);
      if (foundBotList.includes(mentionBot.id)) {
        if (foundBotList.length === 1) {
          console.log(foundBotList.length);
          const alreadyMonit = new MessageEmbed()
            .setColor(color)
            .setDescription(`<@${mentionBot.id}> will no longer be monitored! A`);
          message.channel.send(alreadyMonit).then((msg) => {
            msg.delete({ timeout: 10000 });
          });
          const update = db.prepare('UPDATE watchedbots SET botid = (@botid) WHERE guildid = (@guildid)');
          update.run({
            guildid: `${message.guild.id}`,
            botid: null,
          });
          // activity
          const activityGrab = db.prepare('SELECT botid FROM watchedbots').all();
          let count = 0;
          for (guild of activityGrab) {
            if (guild.botid) {
              const arr = guild.botid.slice(1, guild.botid.length - 1).split(',');
              count += arr.length;
            }
          }
          bot.user.setActivity(`${count} Bots Across ${bot.guilds.cache.size} Guilds | ${prefix}help`, {
            type: 'WATCHING',
          });
          return;
        }
        const alreadyMonit = new MessageEmbed()
          .setColor(color)
          .setDescription(`<@${mentionBot.id}> will no longer be monitored!`);
        message.channel.send(alreadyMonit).then((msg) => {
          msg.delete({ timeout: 10000 });
        });
        const mentions = message.mentions.members.map((memID) => memID.id);
        for (const botid of mentions) {
          if (foundBotList.includes(mentionBot.id)) {
            const index = foundBotList.indexOf(botid);
            foundBotList.splice(index, 1);
            const updateRoleList = db.prepare(
              'UPDATE watchedbots SET botid = (@botid) WHERE guildid = (@guildid)',
            );
            updateRoleList.run({
              guildid: `${message.guild.id}`,
              botid: JSON.stringify(foundBotList),
            });
            // activity
            const activityGrab = db.prepare('SELECT botid FROM watchedbots').all();
            let count = 0;
            for (guild of activityGrab) {
              if (guild.botid) {
                const arr = guild.botid.slice(1, guild.botid.length - 1).split(',');
                count += arr.length;
              }
            }
            bot.user.setActivity(`${count} Bots Across ${bot.guilds.cache.size} Guilds | ${prefix}help`, {
              type: 'WATCHING',
            });
          }
        }
      } else {
        const noMonit = new MessageEmbed()
          .setColor(color)
          .setDescription(`<@${mentionBot.id}> is not being monitored!`);
        message.channel.send(noMonit).then((msg) => {
          msg.delete({ timeout: 10000 });
        });
      }
    }
  },
};
