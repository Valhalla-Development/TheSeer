const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();
const config = require("./Storage/config.json");
const prefixgen = config.prefix;
const SQLite = require('better-sqlite3');
const db = new SQLite('./Storage/db/db.sqlite');

client.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
  if (err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    console.log(
      new Error(
        "[The Seer] An error occurred! Please contact Ragnar Lothbrok#1948"
      )
    );
    process.exit(1);
    return;
  }

  jsfile.forEach(f => {
    let props = require(`./commands/${f}`);
    console.log(`[The Seer] Loaded ${f}.`);
    client.commands.set(props.help.name, props);
  });
});

if (process.version.slice(1).split(".")[0] < 8) {
  console.log(
    new Error(
      `[The Seer] You must have NodeJS 8 or higher installed on your PC.`
    )
  );
  process.exit(1);
}

client.login(config.token);

// error notifiers
client.on("error", e => {
  console.error(e);
});

client.on("warn", e => {
  console.warn(e);
});

process.on("unhandledRejection", error => {
  console.error(`Error: \n${error.stack}`);
});

// client ready event
client.on("ready", () => {
  // console logs

  setTimeout(() => {
    console.log(
      `Invite link: https://discordapp.com/oauth2/authorize?client_id=${
        client.user.id
      }&scope=bot&permissions=8\nType ${prefixgen}help to get a list of commands to use!`
    );
  }, 1000);

  // activity

  client.user.setActivity(`${client.users.size} Bots | Across ${client.guilds.size} Guilds`, {
    type: "WATCHING"
  });

  // setprefix table
  const setprefix = db.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'setprefix';").get();
  if (!setprefix['count(*)']) {
    console.log('setprefix table created!');
    db.prepare("CREATE TABLE setprefix (guildid TEXT PRIMARY KEY, prefix TEXT);").run();
    db.prepare("CREATE UNIQUE INDEX idx_setprefix_id ON setprefix (guildid);").run();
    db.pragma("synchronous = 1");
    db.pragma("journal_mode = wal");
  }
});

client.on("guildDelete", guild => {
  // when the bot is removed from a guild.
  client.user.setActivity(`${client.users.size} Bots | Across ${client.guilds.size} Guilds`, {
    type: "WATCHING"
  });
  // setprefix table
  const delpre = db.prepare("SELECT count(*) FROM setprefix WHERE guildid = ?;").get(guild.id);
  if (delpre['count(*)']) {
    db.prepare("DELETE FROM setprefix WHERE guildid = ?").run(guild.id);
  }
});

client.on("guildCreate", guild => {
  //  when the bot joins a guild.
  client.user.setActivity(`${client.users.size} Bots | Across ${client.guilds.size} Guilds`, {
    type: "WATCHING"
  });
});

// guild join event
client.on('guildCreate', guild => {
  let defaultChannel = "";
  guild.channels.forEach((channel) => {
    if (channel.type == "text" && defaultChannel == "") {
      if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
        defaultChannel = channel;
      }
    }
  });
  let embed = new Discord.RichEmbed()
    .setTitle(`Hello, I'm **The Seer**! Thanks for inviting me!`)
    .setDescription(`The prefix for all my commands is \`-\`, e.g: \`-help\`.`);
  defaultChannel.send({
    embed
  });
});

// client message event
client.on("message", message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let command = messageArray[0].toLowerCase();
  let args = messageArray.slice(1);
  let argresult = args.join(" ");

  // custom prefixes
  const prefixes = db.prepare("SELECT count(*) FROM setprefix WHERE guildid = ?").get(message.guild.id);
  if (!prefixes['count(*)']) {
    const insert = db.prepare("INSERT INTO setprefix (guildid, prefix) VALUES (@guildid, @prefix);");
    insert.run({
      guildid: `${message.guild.id}`,
      prefix: 'ts;'
    });
    return;
  }

  // prefix command
  let prefixgrab = db.prepare("SELECT prefix FROM setprefix WHERE guildid = ?").get(message.guild.id);

  let prefixcommand = prefixgrab.prefix;

  if (command === prefixgen + 'prefix') {
    let embed = new Discord.RichEmbed()
      .setColor(color)
      .setDescription(`This server's prefix is: \`${prefixcommand}\``);
    message.channel.send(embed);
  }

  let prefix = prefixgrab.prefix;

  if (!message.content.startsWith(prefix)) return;

  // command hanler

  let commandfile = client.commands.get(cmd.slice(prefix.length));
  if (commandfile) commandfile.run(client, message, args);

});