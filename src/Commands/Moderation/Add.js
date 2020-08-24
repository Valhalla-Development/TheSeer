const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const SQLite = require('better-sqlite3');
const db = new SQLite('./Storage/DB/db.sqlite');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Adds a bot to the watchlist.',
			category: 'Moderation',
			usage: '<@bot>'
		});
	}

	async run(message, args) {
		if (!message.member.hasPermission('MANAGE_GUILD') && !this.client.owners.includes(message.author.id)) {
			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'A10000')
				.addField(`**${this.client.user.username} - Add**`,
					`**◎ Error:** You need to have \`MANAGE_SERVER\` permission to use this command`);
			message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
			return;
		}

		if (!message.member.guild.me.hasPermission('EMBED_LINKS')) {
			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'A10000')
				.addField(`**${this.client.user.username} - Add**`,
					`**◎ Error:** I need to have \`EMBED_LINKS\` permission to use this command`);
			message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
			return;
		}

		if (!args[0]) {
			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'A10000')
				.addField(`**${this.client.user.username} - Add**`,
					`**◎ Error:** Incorrect usage! Please use: \`${this.client.prefix}add <@bot>`);
			message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
			return;
		}

		const mentionBot = message.mentions.members.first();

		if (!mentionBot) {
			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'A10000')
				.addField(`**${this.client.user.username} - Add**`,
					`**◎ Error:** You need to mention a bot!`);
			message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
			return;
		}

		if (mentionBot.id === this.client.user.id) {
			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'A10000')
				.addField(`**${this.client.user.username} - Add**`,
					`**◎ Error:** I can not monitor myself.`);
			message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
			return;
		}

		if (!mentionBot.user.bot) {
			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'A10000')
				.addField(`**${this.client.user.username} - Add**`,
					`**◎ Error:** the tagged user, was not a bot.`);
			message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
			return;
		}

		const botList = [];
		const checkExists = db.prepare('SELECT * FROM watchedbots WHERE guildid = ?;').get(message.guild.id);
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

		if (checkExists) {
			if (checkExists.botid) {
				const foundBotList = JSON.parse(checkExists.botid);
				if (foundBotList.includes(mentionBot.id)) {
					const embed = new MessageEmbed()
						.setColor(message.guild.me.displayHexColor || 'A10000')
						.addField(`**${this.client.user.username} - Add**`,
							`**◎ Error:** <@${mentionBot.id}> is already being monitored.`);
					message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
					return;
				}
				foundBotList.push(mentionBot.id);
				const update = db.prepare('UPDATE watchedbots SET botid = (@botid) WHERE guildid = (@guildid)');
				update.run({
					guildid: `${message.guild.id}`,
					botid: JSON.stringify(foundBotList)
				});
				// activity
				this.client.user.setActivity(`${count.toLocaleString('en')} Bots Across ${this.client.guilds.cache.size.toLocaleString('en')} Guilds | ${this.client.prefix}help`, {
					type: 'WATCHING'
				});
				const embed = new MessageEmbed()
					.setColor(message.guild.me.displayHexColor || 'A10000')
					.addField(`**${this.client.user.username} - Add**`,
						`**◎ Success:** <@${mentionBot.id}> is now being monitored.`);
				message.channel.send(embed);
			} else {
				botList.push(mentionBot.id);
				const update = db.prepare('UPDATE watchedbots SET botid = (@botid) WHERE guildid = (@guildid)');
				update.run({
					guildid: `${message.guild.id}`,
					botid: JSON.stringify(botList)
				});
				// activity
				this.client.user.setActivity(`${count.toLocaleString('en')} Bots Across ${this.client.guilds.cache.size.toLocaleString('en')} Guilds | ${this.client.prefix}help`, {
					type: 'WATCHING'
				});

				const embed = new MessageEmbed()
					.setColor(message.guild.me.displayHexColor || 'A10000')
					.addField(`**${this.client.user.username} - Add**`,
						`**◎ Success:** <@${mentionBot.id}> is now being monitored.`);
				message.channel.send(embed);
			}
		} else {
			botList.push(mentionBot.id);
			const insert = db.prepare('INSERT INTO watchedbots (guildid, botid) VALUES (@guildid, @botid)');
			insert.run({
				guildid: `${message.guild.id}`,
				botid: JSON.stringify(botList)
			});
			// activity
			this.client.user.setActivity(`${count.toLocaleString('en')} Bots Across ${this.client.guilds.cache.size.toLocaleString('en')} Guilds | ${this.client.prefix}help`, {
				type: 'WATCHING'
			});

			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'A10000')
				.addField(`**${this.client.user.username} - Add**`,
					`**◎ Success:** <@${mentionBot.id}> is now being monitored.`);
			message.channel.send(embed);
		}
	}

};
