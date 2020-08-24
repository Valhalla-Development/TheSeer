const Event = require('../../Structures/Event');
const SQLite = require('better-sqlite3');
const db = new SQLite('./Storage/DB/db.sqlite');

module.exports = class extends Event {

	async run(guild) {
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
		this.client.user.setActivity(`${count.toLocaleString('en')} Bots Across ${this.client.guilds.cache.size.toLocaleString('en')} Guilds | ${this.client.prefix}help`, {
			type: 'WATCHING'
		});

		// watched bots table delete
		const delpre = db.prepare('SELECT count(*) FROM watchedbots WHERE guildid = ?;').get(guild.id);
		if (delpre['count(*)']) {
			db.prepare('DELETE FROM watchedbots WHERE guildid = ?').run(guild.id);
		}
	}

};
