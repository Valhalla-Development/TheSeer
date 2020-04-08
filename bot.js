const { Client, Collection } = require('discord.js');
const { token, logging } = require('./botconfig.json');

const bot = new Client();

['aliases', 'commands'].forEach((x) => bot[x] = new Collection());
['command', 'event'].forEach((x) => require(`./handlers/${x}`)(bot));

if (process.version.slice(1).split('.')[0] < 12) { // Check Node version
  console.log(
    new Error(
      '[The Seer] You must have NodeJS 12 or higher installed on your PC.',
    ),
  );
  process.exit(1);
}

if (logging !== true && logging !== false) { // Checks if logging is enabled/disabled, exits if neither is selected
  console.log(
    new TypeError('[The Seer] The \'logging\' value must be true or false.'),
  );
  process.exit(1);
}

if (logging === true) { // Logging enabled message
  console.log(
    '[The Seer] Logging enabled! When someone executes a command, I will log that here.',
  );
}

// error notifiers
bot.on('error', (e) => {
  console.error(e);
});

bot.on('warn', (e) => {
  console.warn(e);
});

bot.login(token);
