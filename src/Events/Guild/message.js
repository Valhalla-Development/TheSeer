const Event = require('../../Structures/Event');
const moment = require('moment');

module.exports = class extends Event {

	async run(message) {
		if (!message.guild || message.author.bot) return;

		const mentionRegex = RegExp(`^<@!${this.client.user.id}>$`);

		if (message.content.match(mentionRegex)) message.channel.send(`My prefix for ${message.guild.name} is \`${this.client.prefix}\`.`);

		const [cmd, ...args] = message.content.slice(this.client.prefix.length).trim().split(/ +/g);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));

		if (!message.content.startsWith(this.client.prefix)) return;

		if (command) {
			command.run(message, args);
		}

		const oargresult = message.content.split(' ').slice(1).join(' ');

		// Logging
		if (this.client.logging === true) {
			if (!oargresult || oargresult === '') {
				const LoggingNoArgs = `[\x1b[31m${moment().format('LLLL')}\x1b[0m] Command \`${cmd}\` was executed by \x1b[31m${message.author.tag}\x1b[0m (Guild: \x1b[31m${message.guild.name}\x1b[0m)`;
				if (this.client.user.id === '508756879564865539') {
					this.client.channels.cache.get('694680953133596682').send(`${cmd} - was executed by ${message.author.tag} - In guild: ${message.guild.name}`, { code: 'css' });
				}
				console.log(LoggingNoArgs);
			} else {
				const LoggingArgs = `[\x1b[31m${moment().format('LLLL')}\x1b[0m] Command \`${cmd} ${oargresult}\` was executed by \x1b[31m${message.author.tag}\x1b[0m (Guild: \x1b[31m${message.guild.name}\x1b[0m)`;
				if (this.client.user.id === '508756879564865539') {
					this.client.channels.cache.get('694680953133596682').send(`${cmd} ${oargresult} - was executed by ${message.author.tag} - In guild: ${message.guild.name}`, { code: 'css' });
				}
				console.log(LoggingArgs);
			}
		}
	}

};

