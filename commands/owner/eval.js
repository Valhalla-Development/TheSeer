/* eslint-disable no-eval */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const { MessageEmbed } = require('discord.js');
const SQLite = require('better-sqlite3');
const { ownerid, prefix, color } = require('../../botconfig.json');

const db = new SQLite('./db/db.sqlite');

module.exports = {
  config: {
    name: 'eval',
    description: 'Evaluates code',
    accessableby: 'Bot Owner',
    type: 'owner',
    usage: `${prefix}eval <input>`,
  },
  run: async (bot, message, args) => {
    // Not my code, but works as intended

    if (message.author.id !== ownerid) return;

    function clean(text) {
      if (typeof (text) === 'string') return text.replace(/'/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
      return text;
    }

    const argresult = args.join(' ');
    if (message.author.id !== ownerid) {
      // Check if user have Permissions to use the command
      message.channel.send('You Don\'t Have Permissions To Use This Command !'); // Send Message to the channel if they dont have permissions
      return; // Returns the code so the rest doesn't run
    }
    if (!argresult) return message.channel.send('Please Specify a Code To Run!');

    try {
      let evaled = eval(argresult);

      if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
      if (evaled.includes(bot.token)) {
        console.log(`\n${message.author.username}#${message.author.discriminator} Tried to get the bot token on ${message.guild.name} (ServerID: ${message.guild.id}).\n`);
        return message.channel.send('', {
          embed: {
            color,
            title: ':exclamation::exclamation: No :exclamation::exclamation:',
            description: 'No Token For You!',
          },
        });
      }

      const embed = new MessageEmbed()
        .addField(`${bot.user.username} - JavaScript Eval Success:`, '** **')
        .addField(':inbox_tray: **INPUT**', `\`\`\`${args.join(' ')}\`\`\``)
        .addField(':outbox_tray: **OUTPUT**', `\`\`\`${clean(evaled)}\`\`\``)
        .setColor(color)
        .setFooter(message.createdAt, message.author.avatarURL);
      message.channel.send({
        embed,
      });
    } catch (err) {
      message.channel.send(new MessageEmbed()
        .addField(`${bot.user.username} - JavaScript Eval Error:`, 'There Was a Problem With The Code That You Are Trying To Run!')
        .addField(':no_entry: ERROR', `\`\`\`${clean(err)}\`\`\``)
        .setColor(color)
        .setFooter(message.createdAt, message.author.avatarURL))

        .catch((error) => message.channel.send(`**ERROR:** ${error.message}`));
    }
  },
};
