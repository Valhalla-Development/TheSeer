const SQLite = require('better-sqlite3');
const { prefix } = require('../../botconfig.json');

const db = new SQLite('./storage/db/db.sqlite');

module.exports = async (bot, guild) => {
  // when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);

  // activity
  const watchbotgrab = db.prepare('SELECT count(*) FROM watchedbots').get();
  bot.user.setActivity(`${watchbotgrab['count(*)']} Bots Across ${bot.guilds.cache.size} Guilds | ${prefix}help`, {
    type: 'WATCHING',
  });

  // watched bots table
  const delpre = db
    .prepare('SELECT count(*) FROM watchedbots WHERE guildid = ?;')
    .get(guild.id);
  if (delpre['count(*)']) {
    db.prepare('DELETE FROM watchedbots WHERE guildid = ?').run(guild.id);
  }
};
