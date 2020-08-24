const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['pong'],
			description: 'Displays bot and API ping.',
			category: 'Informative'
		});
	}

	async run(message) {
		const msg = await message.channel.send('Pinging...');

		const latency = msg.createdTimestamp - message.createdTimestamp;

		msg.delete();

		const embed = new MessageEmbed()
			.setColor(message.guild.me.displayHexColor || 'A10000')
			.addField(`**${this.client.user.username} - Ping**`, [
				`**◎ Bot Latency:** \`${latency}ms\``,
				`**◎ API Latency:** \`${Math.round(this.client.ws.ping)}ms\``
			]);
		message.channel.send(embed);
	}

};
