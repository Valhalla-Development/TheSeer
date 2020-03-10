const SQLite = require('better-sqlite3');
const { prefix } = require('../../botconfig.json');

const db = new SQLite('./db/db.sqlite');

module.exports = async (bot) => {
  console.log(`${bot.user.username} is online`);

  // watched bots table
  const watchedbots = db.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'watchedbots';").get();
  if (!watchedbots['count(*)']) {
    console.log('watchedbots table created!');
    db.prepare('CREATE TABLE watchedbots (guildid TEXT, botid TEXT, chanid TEXT, dmid TEXT);').run();
    db.prepare('CREATE UNIQUE INDEX idx_watchedbots_id ON watchedbots (botid);').run();
    db.pragma('synchronous = 1');
    db.pragma('journal_mode = wal');
  }

  // activity
  const watchbotgrab = db.prepare('SELECT count(*) FROM watchedbots').get();
  bot.user.setActivity(`${watchbotgrab['count(*)']} Bots Across ${bot.guilds.cache.size} Guilds | ${prefix}help`, {
    type: 'WATCHING',
  });
};
