const Event = require('../../Structures/Event');
const { MessageEmbed } = require('discord.js');
const SQLite = require('better-sqlite3');
const db = new SQLite('./Storage/DB/db.sqlite');

module.exports = class extends Event {

	async run(guild) {
		// logs in console when the bot is added to a guild
		console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);

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

		// finds the default channel
		let defaultChannel = '';
		guild.channels.cache.forEach((channel) => {
			if (channel.type === 'text' && defaultChannel === '') {
				if (channel.permissionsFor(guild.me).has('SEND_MESSAGES')) {
					defaultChannel = channel;
				}
			}
		});

		// remove this if you like, this sends the following message to the first channel it can
		const embed = new MessageEmbed()
			.setTitle('Hello, I\'m **The Seer**! Thanks for inviting me!')
			.setDescription(`The prefix for all my commands is \`${this.client.prefix}\`, e.g: \`${this.client.prefix}help\`.\nIf you find any bugs, report them with \`${this.client.prefix}bugreport <bug>\``);
		defaultChannel.send({
			embed
		});
	}

};
