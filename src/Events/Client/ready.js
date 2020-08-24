const Event = require('../../Structures/Event');
const SQLite = require('better-sqlite3');
const db = new SQLite('./Storage/DB/db.sqlite');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true
		});
	}

	run() {
		console.log([
			`Logged in as ${this.client.user.tag}`,
			`Loaded ${this.client.commands.size} commands!`,
			`Loaded ${this.client.events.size} events!`,
			`Scanning for guilds...\n\x1b[31m[-]\x1b[0m ${this.client.guilds.cache.map((n) => `${n.name} (ID: \x1b[31m${n.id}\x1b[0m)`).join('\x1b[31m\n[-]\x1b[0m ')}`
		].join('\n'));

		setTimeout(() => {
			console.log(`Invite link: https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=387264\n`);
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
	}

};
