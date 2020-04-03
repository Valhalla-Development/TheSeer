const { MessageEmbed } = require('discord.js');
const { prefix } = require('../../botconfig.json');

module.exports = {
  config: {
    name: 'support',
    usage: `${prefix}support`,
    category: 'informative',
    description: 'Posts a link to the bots support server',
    accessableby: 'Everyone',
  },
  run: async (bot, message, color) => {
    if (!message.member.guild.me.hasPermission('EMBED_LINKS')) {
      message.channel.send('I need the permission `Embed Links` for this command!');
      return;
    }

    const embed = new MessageEmbed()
      .setColor(color)
      .setDescription(
        ':white_check_mark: **Support Server Invite**: https://discord.gg/Q3ZhdRJ',
      );
    message.channel.send(embed);
  },
};
