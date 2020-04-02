/* eslint-disable consistent-return */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-unused-vars */
const { MessageEmbed } = require('discord.js');
const SQLite = require('better-sqlite3');

const db = new SQLite('./db/db.sqlite');
const { readdirSync } = require('fs');
const { join } = require('path');
const { ownerID, color, prefix } = require('../../botconfig.json');

module.exports = {
  config: {
    name: 'reload',
    usage: `${prefix}reload <plugin>`,
    category: 'owner',
    description: ' ',
    accessableby: 'Owner',
  },
  run: async (bot, message, args) => {
    if (!message.member.guild.me.hasPermission('EMBED_LINKS')) {
      message.channel.send('I need the permission `Embed Links` for this command!');
      return;
    }

    if (message.author.id !== ownerID) return;

    if (!args[0]) {
      const noArgs = new MessageEmbed()
        .setColor(color)
        .setDescription('Please provide a command to reload!');
      message.channel.send(noArgs).then((msg) => {
        msg.delete({ timeout: 10000 });
      });
      return;
    }
    const commandName = args[0].toLowerCase();
    if (!bot.commands.get(commandName)) {
      const notaCommand = new MessageEmbed()
        .setColor(color)
        .setDescription(':x: That command does not exist! Try again.');
      message.channel.send(notaCommand).then((msg) => {
        msg.delete({ timeout: 10000 });
      });
      return;
    }
    readdirSync(join(__dirname, '..')).forEach((f) => {
      const files = readdirSync(join(__dirname, '..', f));
      if (files.includes(`${commandName}.js`)) {
        try {
          delete require.cache[
            require.resolve(join(__dirname, '..', f, `${commandName}.js`))
          ];
          bot.commands.delete(commandName);
          const pull = require(`../${f}/${commandName}.js`);
          bot.commands.set(commandName, pull);
          const success = new MessageEmbed()
            .setColor(color)
            .setDescription(`Successfully reloaded \`${commandName}\``);
          return message.channel.send(success).then((msg) => {
            msg.delete({ timeout: 10000 });
          });
        } catch (e) {
          const errorCatch = new MessageEmbed()
            .setColor(color)
            .setDescription(`Could not reload: \`${args[0].toUpperCase()}\``);
          return message.channel.send(errorCatch).then((msg) => {
            msg.delete({ timeout: 10000 });
          });
        }
      }
    });
  },
};
