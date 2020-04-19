const { MessageEmbed } = require('discord.js');
const SQLite = require('better-sqlite3');
const { prefix } = require('../../botconfig.json');

const db = new SQLite('./db/db.sqlite');

module.exports = async (bot, guild) => {
  console.log( // logs in console when the bot is added to a guild
    `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${
      guild.memberCount
    } members!`,
  );

  // activity
  const activityGrab = db.prepare('SELECT botid FROM watchedbots').all();
  let count = 0;
  let dbdata;
  for (dbdata of activityGrab) {
    if (dbdata.botid) {
      const arr = dbdata.botid.slice(1, dbdata.botid.length - 1).split(',');
      count += arr.length;
    }
  }
  bot.user.setActivity(`${count} Bots Across ${bot.guilds.cache.size} Guilds | ${prefix}help`, {
    type: 'WATCHING',
  });

  let defaultChannel = ''; // finds the default channel
  guild.channels.cache.forEach((channel) => {
    if (channel.type === 'text' && defaultChannel === '') {
      if (channel.permissionsFor(guild.me).has('SEND_MESSAGES')) {
        defaultChannel = channel;
      }
    }
  });
  const embed = new MessageEmbed() // remove this if you like, this sends the following message to the first channel it can
    .setTitle('Hello, I\'m **The Seer**! Thanks for inviting me!')
    .setDescription('The prefix for all my commands is `ts;`, e.g: `ts;help`.\nIf you find any bugs, report them with `-bugreport <bug>`');
  defaultChannel.send({
    embed,
  });
};
