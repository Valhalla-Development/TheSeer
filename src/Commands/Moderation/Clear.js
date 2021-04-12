const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const SQLite = require('better-sqlite3');
const db = new SQLite('./Storage/DB/db.sqlite');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Clears the database for the guild.',
			category: 'Moderation'
		});
	}

	async run(message) {
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

		this.client.getTable = db.prepare('SELECT * FROM watchedbots WHERE guildid = ?');

		let status;
		if (message.guild.id) {
			status = this.client.getTable.get(message.guild.id);
		}

		if (!status) {
			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'A10000')
				.addField(`**${this.client.user.username} - Clear**`,
					`**◎ Error:** I found no data in the database!`);
			message.channel.send(embed).then((m) => m.delete({ timeout: 15000 }));
			return;
		}

		const embed = new MessageEmbed()
			.setColor(message.guild.me.displayHexColor || 'A10000')
			.setFooter('This action will be cancled in 30 seconds.')
			.addField(`**${this.client.user.username} - Clear**`,
				`**◎ Awaiting:** Are you sure you wish to clear the database?\n**This action is irreversible**\nReact with ✅ to continue.`);
		message.channel.send(embed).then(async (a) => {
			a.react('✅');

			const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;

			a.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
				.then(collected => {
					const reaction = collected.first();

					if (reaction.emoji.name === '✅') {
						a.delete();
						const embed1 = new MessageEmbed()
							.setColor(message.guild.me.displayHexColor || 'A10000')
							.addField(`**${this.client.user.username} - Clear**`,
								`**◎ Success:** Database cleared!`);
						message.channel.send(embed1);
						db.prepare('DELETE FROM watchedbots WHERE guildid = ?').run(message.guild.id);
						return;
					}
				}).catch(() => {
					const embed2 = new MessageEmbed()
						.setColor(message.guild.me.displayHexColor || 'A10000')
						.addField(`**${this.client.user.username} - Clear**`,
							`**◎ Error:** Clear canclled. You did not react in the given time.`);
					message.channel.send(embed2).then((m) => m.delete({ timeout: 15000 }));
					a.delete();
				});
		});
	}

};
