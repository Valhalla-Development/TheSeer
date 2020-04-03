const { MessageEmbed } = require('discord.js');
const { prefix } = require('../../botconfig.json');

module.exports = {
  config: {
    name: 'invite',
    usage: `${prefix}invite`,
    category: 'informative',
    description: 'Posts a bot invite link',
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
        ':white_check_mark: **Bot Invite Link**: [Click Me](https://discordapp.com/oauth2/authorize?client_id=559113940919910406&scope=bot&permissions=387264)',
      );
    message.channel.send(embed);
  },
};
