/* eslint-disable no-undef */
const SQLite = require('better-sqlite3');
const { prefix } = require('../../botconfig.json');

const db = new SQLite('./db/db.sqlite');

module.exports = async (bot) => {
  console.log(`${bot.user.username} is online`); // posts in console when online

  setTimeout(() => {
    console.log(`Invite link: https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=387264\n`);
  }, 1000);

  // watched bots table creation
  const watchedbots = db.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'watchedbots';").get();
  if (!watchedbots['count(*)']) {
    console.log('watchedbots table created!');
    db.prepare('CREATE TABLE watchedbots (guildid TEXT, botid TEXT, chanid TEXT, dmid TEXT);').run();
    db.prepare('CREATE UNIQUE INDEX idx_watchedbots_id ON watchedbots (guildid);').run();
    db.pragma('synchronous = 1');
    db.pragma('journal_mode = wal');
  }

  // activity
  const dataGrab = db.prepare('SELECT botid FROM watchedbots').all();
  let count = 0;
  for (guild of dataGrab) {
    if (guild.botid) {
      const arr = guild.botid.slice(1, guild.botid.length - 1).split(',');
      count += arr.length;
    }
  }
  bot.user.setActivity(`${count} Bots Across ${bot.guilds.cache.size} Guilds | ${prefix}help`, {
    type: 'WATCHING',
  });
};
