const { MessageEmbed } = require('discord.js');
const SQLite = require('better-sqlite3');
const { ownerid, prefix, color } = require('../../botconfig.json');

const db = new SQLite('./db/db.sqlite');

module.exports = {
  config: {
    name: 'dm',
    description: 'sets alerts to DM for the watchlist',
    usage: `${prefix}dm <on/off>`,
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
        .setDescription(`Incorrect usage! Correct usage: \`${prefix}dm <on/off>\``);
      message.channel.send(noInput).then((msg) => {
        msg.delete({ timeout: 10000 });
      });
      return;
    }

    const noDm = new MessageEmbed()
      .setColor(color)
      .setDescription('You need to have DM from server members enabled!');

    const checkExists = db.prepare('SELECT dmid FROM watchedbots WHERE guildid = ?;').get(message.guild.id);
    if (args[0] === 'on') {
      if (checkExists) {
        if (checkExists.dmid === message.author.id) {
          const alreadyOn = new MessageEmbed()
            .setColor(color)
            .setDescription('You already have DM alerts enabled!');
          message.channel.send(alreadyOn).then((msg) => {
            msg.delete({ timeout: 10000 });
          });
        } else {
          const turnedOn = new MessageEmbed()
            .setColor(color)
            .setDescription('You will now receive DM alerts!');
          message.author.send(turnedOn).then(() => {
            message.channel.send(turnedOn).then((msg) => {
              msg.delete({ timeout: 10000 });
            });
            const update = db.prepare('UPDATE watchedbots SET dmid = (@dmid) WHERE guildid = (@guildid);');
            update.run({
              guildid: `${message.guild.id}`,
              dmid: `${message.author.id}`,
            });
          }).catch(() => message.channel.send(noDm));
        }
      } else {
        const turnedOn = new MessageEmbed()
          .setColor(color)
          .setDescription('You will now receive DM alerts!');
        message.author.send(turnedOn).then(() => {
          message.channel.send(turnedOn).then((msg) => {
            msg.delete({ timeout: 10000 });
          });
          const insert = db.prepare('INSERT INTO watchedbots (guildid, dmid) VALUES (@guildid, @dmid);');
          insert.run({
            guildid: `${message.guild.id}`,
            dmid: `${message.author.id}`,
          });
        }).catch(() => message.channel.send(noDm));
      }
    } else if (args[0] === 'off') {
      if (checkExists) {
        if (checkExists.dmid === message.author.id) {
          const turnedOff = new MessageEmbed()
            .setColor(color)
            .setDescription('DM alerts disabled! :slight_smile:');
          message.channel.send(turnedOff).then((msg) => {
            msg.delete({ timeout: 10000 });
          });
          const remove = db.prepare('UPDATE watchedbots SET dmid = (@dmid) WHERE guildid = (@guildid);');
          remove.run({
            guildid: `${message.guild.id}`,
            dmid: null,
          });
        } else {
          const alreadyOff = new MessageEmbed()
            .setColor(color)
            .setDescription('DM alerts are already disabled!');
          message.channel.send(alreadyOff).then((msg) => {
            msg.delete({ timeout: 10000 });
          });
        }
      } else {
        const alreadyOff = new MessageEmbed()
          .setColor(color)
          .setDescription('DM alerts are already disabled!');
        message.channel.send(alreadyOff).then((msg) => {
          msg.delete({ timeout: 10000 });
        });
      }
    }
  },
};
