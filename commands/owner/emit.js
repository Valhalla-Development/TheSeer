const { MessageEmbed } = require('discord.js');
const { ownerid, prefix } = require('../../botconfig.json');

module.exports = {
  config: {
    name: 'emit',
    usage: `${prefix}emit`,
    category: 'Owner',
    description: 'Emits an event',
    accessableby: 'Owner',
  },
  run: async (bot, message, args, color) => {
    if (!message.member.guild.me.hasPermission('EMBED_LINKS')) {
      message.channel.send('I need the permission `Embed Links` for this command!');
      return;
    }

    if (message.author.id !== ownerid) return;

    if (args[0] === undefined) {
      const noArgs = new MessageEmbed()
        .setColor(color)
        .setDescription(
          `**Available Commands**:\n\n${prefix}emit guildMemberAdd\n${prefix}emit guildMemberRemove`,
        );
      message.channel.send(noArgs);
    }
    if (args[0] === 'presenceUpdate') { // emits the event, mainly used for testing
      bot.emit('presenceUpdate', message.member);
    }
  },
};
