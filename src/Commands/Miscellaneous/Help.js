const { MessageEmbed } = require('discord.js');
const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['halp'],
			description: 'Display command list / command usage.',
			category: 'Informative',
			usage: '[command]'
		});
	}

	async run(message, [command]) {
		const embed = new MessageEmbed()
			.setColor(message.guild.me.displayHexColor || 'A10000')
			.setAuthor(`${message.guild.name} Help`, message.guild.iconURL({ dynamic: true }))
			.setThumbnail(this.client.user.displayAvatarURL())
			.setFooter(`This guild's prefix is ${this.client.prefix}`, this.client.user.avatarURL({ dynamic: true }))
			.setTimestamp();

		if (command) {
			const cmd = this.client.commands.get(command) || this.client.commands.get(this.aliases.get(command));

			if (!cmd) return message.channel.send(`Invalid Command named. \`${command}`);

			embed.setAuthor(`${this.client.utils.capitalise(cmd.name)} Command Help`, this.client.user.displayAvatarURL());
			embed.setDescription([
				`**◎ Aliases:** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'No Aliases'}`,
				`**◎ Description:** ${cmd.description}`,
				`**◎ Category:** ${cmd.category}`,
				`**◎ Usage:** ${cmd.usage}`
			]);

			return message.channel.send(embed);
		} else {
			embed.setDescription([
				`Hey, I'm [**__The Seer__**]! A bot that monitors other bots!`,
				`Run \`${this.client.prefix}help <command>\` to see command specific instructions`,
				`All commands must be preceded by \`${this.client.prefix}\``,
				`Command Parameters: \`<>\` is strict & \`[]\` is optional`
			]);
			const categories = this.client.utils.removeDuplicates(this.client.commands.filter(cmd => cmd.category !== 'Owner').map(cmd => cmd.category));

			for (const category of categories) {
				embed.addField(`**${this.client.utils.capitalise(category)} (${this.client.commands.filter(cmd =>
					cmd.category === category).size})**`, this.client.commands.filter(cmd =>
					cmd.category === category).map(cmd => `\`${this.client.utils.capitalise(cmd.name)}\``).join(', '));
			}
			return message.channel.send(embed);
		}
	}

};
