/* eslint-disable consistent-return */
const { MessageEmbed } = require('discord.js');
const { prefix, color } = require('../../botconfig.json');

module.exports = {
  config: {
    name: 'say',
    description: 'sends a message that was inputted to a channel',
    usage: `${prefix}say`,
    category: 'moderation',
    accessableby: 'Staff',
    aliases: ['acc', 'announcement'],
  },
  run: async (bot, message, args) => {
    if (!message.member.hasPermission(['MANAGE_MESSAGES', 'ADMINISTRATOR'])) return message.channel.send('You can not use this command!');

    if (!args[0]) {
      const noArgs = new MessageEmbed()
        .setColor(color)
        .setDescription(`Incorrect usage! Correct usage: \`${prefix}say <#channel> <message>\`\nNote: Channel variable is not needed.`);
      message.channel.send(noArgs).then((m) => m.delete({ timeout: 10000 }));
      return;
    }
    let argsresult;
    const mChannel = message.mentions.channels.first();

    if (mChannel) {
      argsresult = args.slice(1).join(' ');
      mChannel.send(argsresult);
    } else {
      argsresult = args.join(' ');
      message.channel.send(argsresult);
    }
  },
};
