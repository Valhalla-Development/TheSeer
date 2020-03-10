/* eslint-disable max-len */
/* eslint-disable no-plusplus */
const { MessageEmbed } = require('discord.js');
const { prefix, color } = require('../../botconfig.json');

module.exports = {
  config: {
    name: 'help',
    aliases: ['h', 'halp', 'commands'],
    usage: `${prefix}usage`,
    category: 'miscellaneous',
    description: '',
    accessableby: 'Members',
  },
  run: async (bot, message, args) => {
    const arr = [];
    const types = ['Moderation', 'Miscellaneous'];
    const embed = new MessageEmbed();

    if (!args[0]) {
      for (let i = 0; i < types.length; i++) {
        arr.push(bot.commands.filter((c) => c.config.category === types[i].toLowerCase()).map((c) => `\`${c.config.name}\``).join(' '));
        try {
          embed.addField(types[i], arr[i]);
        } catch (e) {
          embed.addBlankField();
        }
      }

      embed.setColor(color)
        .setAuthor(`${message.guild.me.displayName} Help`, message.guild.iconURL)
        .setThumbnail(bot.user.displayAvatarURL)
        .setTimestamp()
        .setDescription(`These are the avaliable commands for the The Seer!\nThe bot prefix is: **${prefix}**`)
        .setFooter('The Seer', bot.user.displayAvatarURL);
      message.channel.send(embed);
    } else {
      const command = bot.commands.get(args[0].toLowerCase()) ? bot.commands.get(args[0].toLowerCase()).config : bot.commands.get(bot.aliases.get(args[0].toLowerCase())).config;

      embed.setColor(color)
        .setAuthor(`${message.guild.me.displayName} Help`, message.guild.iconURL)
        .setThumbnail(bot.user.displayAvatarURL)
        .setDescription(`The bot prefix is: ${prefix}\n\n**Command:** ${command.name}\n**Description:** ${command.description || 'No Description'}\n**Usage:** ${command.usage || 'No Usage'}\n**Accessable by:** ${command.accessableby || 'Members'}\n**Aliases:** ${command.aliases ? command.aliases.join(', ') : 'None'}`);
      message.channel.send(embed);
    }
  },
};
