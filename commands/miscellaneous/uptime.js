/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
const { RichEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
  config: {
    name: 'uptime',
    description: 'Displays the bots current uptime!',
    usage: '!uptime',
    category: 'miscellaneous',
    accessableby: 'Members',
    aliases: ['ut'],
  },
  run: async (bot, message) => {
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

    const duration = moment.duration(bot.uptime);
    const botembed = new RichEmbed()
      .setTitle('Uptime')
      .setColor('RANDOM')
      .setDescription(`${uptime}`);

    message.channel.send(botembed);
  },
};
