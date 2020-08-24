const Event = require('../../Structures/Event');
const { MessageEmbed } = require('discord.js');
const SQLite = require('better-sqlite3');
const db = new SQLite('./Storage/DB/db.sqlite');

module.exports = class extends Event {

	async run(oldPresence, newPresence) {
		// Selects table from db, if does not exist, return
		const watchedbots = db.prepare('SELECT * FROM watchedbots WHERE guildid = ?').get(newPresence.guild.id);

		if (!watchedbots) {
			return;
		}
		const offlineEmbed = new MessageEmbed()
			.setTitle('The Seer Report')
			.setDescription(`<@${newPresence.userID}> is **OFFLINE**`)
			.setColor('#ff2f2f')
			.setTimestamp();

		const onlineEmbed = new MessageEmbed()
			.setTitle('The Seer Report')
			.setDescription(`<@${newPresence.userID}> is **ONLINE**`)
			.setColor('#27d200')
			.setTimestamp();

		// Status other than offline
		const statusList = ['online', 'idle', 'dnd'];
		let channelid;
		let dmid;

		if (watchedbots.chanid) {
			// if the channel is present in db, find it
			channelid = this.client.channels.cache.find((a) => a.id === watchedbots.chanid);
			if (watchedbots.botid) {
				// there is botid data in db, parse the array
				const foundBotList = JSON.parse(watchedbots.botid);
				// if the presenceUpdate id exists in the db...
				if (foundBotList.includes(newPresence.userID)) {
					// if the status has not changed (this event also monitors activity changes)
					if (oldPresence.status === newPresence.status) return;
					// if the status changed between online, idle or dnd, return
					if (statusList.includes(oldPresence.status) && statusList.includes(newPresence.status)) return;
					// if the status changed to offline
					if (newPresence.status === 'offline') {
						channelid.send(offlineEmbed);
						// if it changed to online
					} else {
						channelid.send(onlineEmbed);
					}
				}
			}
		}

		// if dmid data in db
		if (watchedbots.dmid) {
			// parse the data
			const foundBotList = JSON.parse(watchedbots.botid);
			// if the presenceUpdate id exists in the db
			if (foundBotList.includes(newPresence.userID)) {
				// if the status has not changed (this event also monitors activity changes)
				if (oldPresence.status === newPresence.status) return;
				// if the status changed between online, idle or dnd, return
				if (statusList.includes(oldPresence.status) && statusList.includes(newPresence.status)) return;
				// if the dmid is present in db, find it
				dmid = this.client.users.cache.find((a) => a.id === watchedbots.dmid);
				// if the status changed to offline
				if (newPresence.status === 'offline') {
					dmid.send(offlineEmbed);
					// if the status changed to online
				} else {
					dmid.send(onlineEmbed);
				}
			}
		}
	}

};
