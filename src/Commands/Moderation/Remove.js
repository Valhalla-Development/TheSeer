const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const SQLite = require('better-sqlite3');
const db = new SQLite('./Storage/DB/db.sqlite');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Removes a bot from the watchlist',
			category: 'Moderation',
			usage: '<@bot>'
		});
	}

	async run(message, args) {
		// returns if the user does not have manage guild, or is the not the owner
		if (!message.member.hasPermission('MANAGE_GUILD') && !this.client.owners.includes(message.author.id)) {
			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'A10000')
				.addField(`**${this.client.user.username} - Remove**`,
					`**◎ Error:** You need to have \`MANAGE_GUILD\` permission to use this command`);
			message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
			return;
		}
		if (!message.member.guild.me.hasPermission('EMBED_LINKS')) {
			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'A10000')
				.addField(`**${this.client.user.username} - Remove**`,
					`**◎ Error:** I need to have \`EMBED_LINKS\` permission to use this command`);
			message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
			return;
		}

		if (!args[0]) {
			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'A10000')
				.addField(`**${this.client.user.username} - Remove**`,
					`**◎ Error:** Incorrect usage! Please use: \`${this.client.prefix}remove <@bot>`);
			message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
			return;
		}

		const mentionBot = message.mentions.members.first();
		if (!mentionBot) {
			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'A10000')
				.addField(`**${this.client.user.username} - Remove**`,
					`**◎ Error:** You need to mention a bot!`);
			message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
			return;
		}

		if (mentionBot.id === this.client.user.id) {
			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'A10000')
				.addField(`**${this.client.user.username} - Remove**`,
					`**◎ Error:** I can not monitor myself!`);
			message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
			return;
		}

		if (!mentionBot.user.bot) {
			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'A10000')
				.addField(`**${this.client.user.username} - Remove**`,
					`**◎ Error:** The tagged user, was not a bot!`);
			message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
			return;
		}
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

		if (!checkExists) {
			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'A10000')
				.addField(`**${this.client.user.username} - Remove**`,
					`**◎ Error:** No bots are being monitored!`);
			message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
			return;
		}
		if (checkExists.botid) {
			const foundBotList = JSON.parse(checkExists.botid);
			if (foundBotList.includes(mentionBot.id)) {
				if (foundBotList.length === 1) {
					const embed = new MessageEmbed()
						.setColor(message.guild.me.displayHexColor || 'A10000')
						.addField(`**${this.client.user.username} - Remove**`,
							`**◎ Success:** <@${mentionBot.id}> will no longer be monittored.`);
					message.channel.send(embed);
					const update = db.prepare('UPDATE watchedbots SET botid = (@botid) WHERE guildid = (@guildid)');
					update.run({
						guildid: `${message.guild.id}`,
						botid: null
					});
					// activity
					this.client.user.setActivity(`${count.toLocaleString('en')} Bots Across ${this.client.guilds.cache.size.toLocaleString('en')} Guilds | ${this.client.prefix}help`, {
						type: 'WATCHING'
					});
					return;
				}
				const embed = new MessageEmbed()
					.setColor(message.guild.me.displayHexColor || 'A10000')
					.addField(`**${this.client.user.username} - Remove**`,
						`**◎ Success:** <@${mentionBot.id}> will no longer be monittored.`);
				message.channel.send(embed);
				const mentions = message.mentions.members.map((memID) => memID.id);
				for (const botid of mentions) {
					if (foundBotList.includes(mentionBot.id)) {
						const index = foundBotList.indexOf(botid);
						foundBotList.splice(index, 1);
						const updateRoleList = db.prepare(
							'UPDATE watchedbots SET botid = (@botid) WHERE guildid = (@guildid)'
						);
						updateRoleList.run({
							guildid: `${message.guild.id}`,
							botid: JSON.stringify(foundBotList)
						});
						// activity
						this.client.user.setActivity(`${count.toLocaleString('en')} Bots Across ${this.client.guilds.cache.size.toLocaleString('en')} Guilds | ${this.client.prefix}help`, {
							type: 'WATCHING'
						});
					}
				}
			} else {
				const embed = new MessageEmbed()
					.setColor(message.guild.me.displayHexColor || 'A10000')
					.addField(`**${this.client.user.username} - Remove**`,
						`**◎ Error:** <@${mentionBot.id}> is not being monitored!`);
				message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
			}
		}
	}

};
