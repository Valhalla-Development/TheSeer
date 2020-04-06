/* eslint-disable no-template-curly-in-string */
const { MessageEmbed } = require('discord.js');
const { color, prefix } = require('../../botconfig.json');

module.exports = {
  config: {
    name: 'ping',
    description: 'PONG! Displays the api & bot latency',
    usage: `${prefix}ping`,
    category: 'miscellaneous',
    accessableby: 'Members',
  },
  run: async (bot, message) => {
    if (!message.member.guild.me.hasPermission('EMBED_LINKS')) {
      message.channel.send('I need the permission `Embed Links` permission for this command!').then((msg) => {
        msg.delete({ timeout: 10000 });
      });
    }

    const ping = Math.round(bot.ws.ping);

    const embed = new MessageEmbed()
      .setColor(color)
      .setDescription(`My ping is: \`${ping}\` ms`);
    message.channel.send(embed);
  },
};
