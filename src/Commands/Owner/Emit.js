const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Emits a Discord.js event.',
			category: 'Hidden',
			usage: '<event>'
		});
	}

	async run(message, args) {
		if (!this.client.owners.includes(message.author.id)) return;

		if (!message.member.guild.me.hasPermission('EMBED_LINKS')) {
			message.channel.send('I need the permission `Embed Links` for this command!');
			return;
		}

		if (args[0] === undefined) {
			const noArgs = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'A10000')
				.addField(`**${this.client.user.username} - Emit**`,
					`**◎ Available Commands:**\n\`${this.client.prefix}emit presenceUpdate\``);
			message.channel.send(noArgs).then((m) => m.delete({ timeout: 15000 }));
			return;
		}
		if (args[0] === 'presenceUpdate') {
			this.client.emit('presenceUpdate', message.member);
			return;
		}
	}

};
