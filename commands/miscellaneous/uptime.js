/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
const { MessageEmbed } = require('discord.js');
const { color, prefix } = require('../../botconfig.json');

module.exports = {
  config: {
    name: 'uptime',
    description: 'Displays the bots current uptime!',
    usage: `${prefix}uptime`,
    category: 'miscellaneous',
    accessableby: 'Members',
    aliases: ['ut'],
  },
  run: async (bot, message) => {
    if (!message.member.guild.me.hasPermission('EMBED_LINKS')) {
      message.channel.send('I need the permission `Embed Links` permission for this command!').then((msg) => {
        msg.delete({ timeout: 10000 });
      });
    }

    if (message.member.guild.me.hasPermission('MANAGE_MESSAGES')) {
      message.delete();
    }

    function convertMS(ms) {
      let d; let h; let m; let
        s;
      s = Math.floor(ms / 1000);
      m = Math.floor(s / 60);
      s %= 60;
      h = Math.floor(m / 60);
      m %= 60;
      d = Math.floor(h / 24);
      h %= 24;
      return {
        d,
        h,
        m,
        s,
      };
    }
    const u = convertMS(bot.uptime);
    const uptime = `${u.d
    } days : ${
      u.h
    } hours : ${
      u.m
    } minutes : ${
      u.s
    } seconds`;

    const botembed = new MessageEmbed()
      .setTitle('Uptime')
      .setColor(color)
      .setDescription(`${uptime}`);

    message.channel.send(botembed).then((msg) => {
      msg.delete({ timeout: 10000 });
    });
  },
};
