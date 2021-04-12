const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const SQLite = require('better-sqlite3');
const db = new SQLite('./Storage/DB/db.sqlite');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Sets the alert channel.',
			category: 'Moderation',
			usage: '<#channel/off>'
		});
	}

	async run(message, args) {
		if (!message.member.hasPermission('MANAGE_GUILD') && !this.client.owners.includes(message.author.id)) {
			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'A10000')
				.addField(`**${this.client.user.username} - Channel**`,
					`**◎ Error:** You need to have \`MANAGE_GUILD\` permission to use this command`);
			message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
			return;
		}

		if (!message.member.guild.me.hasPermission('EMBED_LINKS')) {
			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'A10000')
				.addField(`**${this.client.user.username} - Channel**`,
					`**◎ Error:** I need to have \`EMBED_LINKS\` permission to use this command`);
			message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
			return;
		}

		if (!args[0]) {
			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'A10000')
				.addField(`**${this.client.user.username} - Channel**`,
					`**◎ Error:** Incorredt usage! Please use: \`${this.client.prefix}channel <#channel/off>\``);
			message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
			return;
		}

		if (args[0] === 'off') {
			this.client.getTable = db.prepare('SELECT chanid FROM watchedbots WHERE guildid = ?');

			let status;
			if (message.guild.id) {
				status = this.client.getTable.get(message.guild.id);
			}

			if (!status) {
				const embed = new MessageEmbed()
					.setColor(message.guild.me.displayHexColor || 'A10000')
					.addField(`**${this.client.user.username} - Channel**`,
						`**◎ Error:** Channel alerts are already disabled!`);
				message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
				return;
			}

			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'A10000')
				.addField(`**${this.client.user.username} - Channel**`,
					`**◎ Success:** Channel alerts disabled!`);
			message.channel.send(embed);
			db.prepare('UPDATE watchedbots SET chanid = (@chan) WHERE guildid = (@guildid);').run({
				guildid: `${message.guild.id}`,
				chan: null
			});
			return;
		}

		const lchan = message.mentions.channels.first();

		if (!lchan) {
			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'A10000')
				.addField(`**${this.client.user.username} - Channel**`,
					`**◎ Error:** You need to tag a channel!`);
			message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
		} else {
			const checkExists = db.prepare('SELECT chanid FROM watchedbots WHERE guildid = ?;').get(message.guild.id);
			if (checkExists) {
				const embed = new MessageEmbed()
					.setColor(message.guild.me.displayHexColor || 'A10000')
					.addField(`**${this.client.user.username} - Channel**`,
						`**◎ Success:** ${lchan} has been set as the alert channel.`);
				message.channel.send(embed);
				const insert = db.prepare('UPDATE watchedbots SET chanid = (@chanid) WHERE guildid = (@guildid);');
				insert.run({
					guildid: `${message.guild.id}`,
					chanid: `${lchan.id}`
				});
			} else {
				const embed = new MessageEmbed()
					.setColor(message.guild.me.displayHexColor || 'A10000')
					.addField(`**${this.client.user.username} - Channel**`,
						`**◎ Success:** ${lchan} has been set as the alert channel.`);
				message.channel.send(embed);
				const insert = db.prepare('INSERT INTO watchedbots (guildid, chanid) VALUES (@guildid, @chanid);');
				insert.run({
					guildid: `${message.guild.id}`,
					chanid: `${lchan.id}`
				});
			}
		}
	}

};
