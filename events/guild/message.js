/* eslint-disable max-len */
const moment = require('moment');
const { prefix, logging } = require('../../botconfig.json');

module.exports = async (bot, message) => {
  if (message.author.bot || message.channel.type === 'dm') return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const messageArray = message.content.split(' ');
  const logArgs = messageArray.slice(1);
  const oargresult = logArgs.join(' ');
  const cmd = args.shift().toLowerCase();

  if (!message.content.startsWith(prefix)) return;
  const commandfile = bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd));
  if (commandfile) {
    commandfile.run(bot, message, args);
    console.log(commandfile.config.name);
    if (message.member.guild.me.hasPermission('MANAGE_MESSAGES')) {
      const cmdToDel = ['help', 'invite', 'ping', 'support', 'uptime', 'say'];
      console.log(cmdToDel.includes(commandfile.config.name));
      if (cmdToDel.includes(commandfile.config.name)) {
        message.delete();
      }
    }
  }

  // Logging
  if (logging === true) {
    if (!oargresult || oargresult === '') {
      const LoggingNoArgs = `[\x1b[36m${moment().format(
        'LLLL',
      )}\x1b[0m] Command \`${cmd}\` was executed by \x1b[36m${
        message.author.tag
      }\x1b[0m (Guild: \x1b[36m${message.guild.name}\x1b[0m)`;

      // These blocked lines can send the command log to a channel of your choosing, simply replace the id with a channel id of your choosing.
      // bot.channels.cache.get('694680953133596682').send(`${cmd} - was executed by ${message.author.tag} - In guild: ${message.guild.name}`, { code: 'css' });
      console.log(LoggingNoArgs);
    } else {
      const LoggingArgs = `[\x1b[36m${moment().format(
        'LLLL',
      )}\x1b[0m] Command \`${cmd} ${oargresult}\` was executed by \x1b[36m${
        message.author.tag
      }\x1b[0m (Guild: \x1b[36m${message.guild.name}\x1b[0m)`;
      // bot.channels.cache.get('694680953133596682').send(`${cmd} ${oargresult} - was executed by ${message.author.tag} - In guild: ${message.guild.name}`, { code: 'css' });
      console.log(LoggingArgs);
    }
  }
};
