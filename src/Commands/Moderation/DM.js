const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const SQLite = require('better-sqlite3');
const db = new SQLite('./Storage/DB/db.sqlite');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Toggles DM alerts.',
			category: 'Moderation',
			usage: '<on/off>'
		});
	}

	async run(message, args) {
		if (!message.member.hasPermission('MANAGE_GUILD') && !this.client.owners.includes(message.author.id)) {
			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'A10000')
				.addField(`**${this.client.user.username} - DM**`,
					`**◎ Error:** You need to have \`MANAGE_SERVER\` permission to use this command`);
			message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
			return;
		}

		if (!message.member.guild.me.hasPermission('EMBED_LINKS')) {
			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'A10000')
				.addField(`**${this.client.user.username} - DM**`,
					`**◎ Error:** I need to have \`EMBED_LINKS\` permission to use this command`);
			message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
			return;
		}

		if (!args[0]) {
			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'A10000')
				.addField(`**${this.client.user.username} - DM**`,
					`**◎ Error:** Incorrect usage! Please use: \`${this.client.prefix}dm <on/off>`);
			message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
			return;
		}

		const noDm = new MessageEmbed()
			.setColor(message.guild.me.displayHexColor || 'A10000')
			.addField(`**${this.client.user.username} - DM**`,
				`**◎ Error:** You need to have DM from server members enabled for this feature!`);

		const checkExists = db.prepare('SELECT dmid FROM watchedbots WHERE guildid = ?;').get(message.guild.id);
		if (args[0] === 'on') {
			if (checkExists) {
				if (checkExists.dmid === message.author.id) {
					const embed = new MessageEmbed()
						.setColor(message.guild.me.displayHexColor || 'A10000')
						.addField(`**${this.client.user.username} - DM**`,
							`**◎ Error:** You already have DM alerts enabled!`);
					message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
				} else {
					const turnedOn = new MessageEmbed()
						.setColor(message.guild.me.displayHexColor || 'A10000')
						.addField(`**${this.client.user.username} - DM**`,
							`**◎ Success:** You will now receive DM alerts!`);
					message.author.send(turnedOn).then(() => {
						message.channel.send(turnedOn);
						const update = db.prepare('UPDATE watchedbots SET dmid = (@dmid) WHERE guildid = (@guildid);');
						update.run({
							guildid: `${message.guild.id}`,
							dmid: `${message.author.id}`
						});
					}).catch(() => message.channel.send(noDm));
				}
			} else {
				const turnedOn = new MessageEmbed()
					.setColor(message.guild.me.displayHexColor || 'A10000')
					.addField(`**${this.client.user.username} - DM**`,
						`**◎ Success:** You will now receive DM alerts!`);
				message.author.send(turnedOn).then(() => {
					message.channel.send(turnedOn);
					const insert = db.prepare('INSERT INTO watchedbots (guildid, dmid) VALUES (@guildid, @dmid);');
					insert.run({
						guildid: `${message.guild.id}`,
						dmid: `${message.author.id}`
					});
				}).catch(() => message.channel.send(noDm));
			}
		} else if (args[0] === 'off') {
			if (checkExists) {
				if (checkExists.dmid === message.author.id) {
					const turnedOff = new MessageEmbed()
						.setColor(message.guild.me.displayHexColor || 'A10000')
						.addField(`**${this.client.user.username} - DM**`,
							`**◎ Success:** You will no longer receive DM alerts!`);
					message.channel.send(turnedOff);
					const remove = db.prepare('UPDATE watchedbots SET dmid = (@dmid) WHERE guildid = (@guildid);');
					remove.run({
						guildid: `${message.guild.id}`,
						dmid: null
					});
				} else {
					const alreadyOff = new MessageEmbed()
						.setColor(message.guild.me.displayHexColor || 'A10000')
						.addField(`**${this.client.user.username} - DM**`,
							`**◎ Success:** DM alerts are already disabled!`);
					message.channel.send(alreadyOff);
				}
			} else {
				const alreadyOff = new MessageEmbed()
					.setColor(message.guild.me.displayHexColor || 'A10000')
					.addField(`**${this.client.user.username} - DM**`,
						`**◎ Success:** DM alerts are already disabled!`);
				message.channel.send(alreadyOff);
			}
		}
	}

};
