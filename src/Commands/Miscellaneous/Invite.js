const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Displays an invite link for the bot.',
			category: 'Informative'
		});
	}

	async run(message) {
		const embed = new MessageEmbed()
			.setColor(message.guild.me.displayHexColor || 'A10000')
			.addField(`**${this.client.user.username} - Invite**`,
				`**◎ [**Bot Invite Link**](https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=387264)`);
		message.channel.send(embed);
	}

};
