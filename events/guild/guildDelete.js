const SQLite = require('better-sqlite3');
const { prefix } = require('../../botconfig.json');

const db = new SQLite('./db/db.sqlite');

module.exports = async (bot, guild) => {
  // when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);

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

  // watched bots table delete
  const delpre = db
    .prepare('SELECT count(*) FROM watchedbots WHERE guildid = ?;')
    .get(guild.id);
  if (delpre['count(*)']) {
    db.prepare('DELETE FROM watchedbots WHERE guildid = ?').run(guild.id);
  }
};
