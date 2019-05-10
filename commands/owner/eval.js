/*jshint -W061 */
const {
  ownerid,
  prefix
} = require("../../botconfig.json");
const {
  RichEmbed
} = require("discord.js");

module.exports = {
  config: {
    name: "eval",
    description: "Evaluates code",
    accessableby: "Bot Owner",
    type: "owner",
    usage: `${prefix}eval <input>`
  },
  run: async (bot, message, args) => {
    if (message.author.id !== ownerid) return;

    function clean(text) {
      if (typeof (text) === "string")
        return text.replace(/'/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
      else
        return text;
    }

    console.log(`\n${message.author.username}#${message.author.discriminator} Used .Eval Command On ${message.guild.name}`);
    let argresult = args.join(' ');
    if (message.author.id !== ownerid) {
      // Check if user have Permissions to use the command
      message.channel.send('You Don\'t Have Permissions To Use This Command !'); // Send Message to the channel if they dont have permissions
      return; // Returns the code so the rest doesn't run
    }
    if (!argresult) {
      return message.channel.send("Please Specify a Code To Run!");
    }

    try {

      var evaled = eval(argresult);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
      if (evaled.includes(bot.token)) {
        console.log(`\n${message.author.username}#${message.author.discriminator} Try To Get The Bot Token On ${message.guild.name} (ServerID: ${message.guild.id}).\n`);
        return message.channel.send("", {
          embed: {
            color: 0xFF5733,
            title: ':exclamation::exclamation: No :exclamation::exclamation:',
            description: `No Token For You!`
          }
        });
      }

      let embed = new RichEmbed()
        .addField(`${bot.user.username} - JavaScript Eval Success:`, `** **`)
        .addField(":inbox_tray: **INPUT**", "```" + args.join(" ") + "```")
        .addField(":outbox_tray: **OUTPUT**", "```" + clean(evaled) + "```")
        .setColor(0xFF5733)
        .setFooter(message.createdAt, message.author.avatarURL);
      message.channel.send({
        embed
      });

    } catch (err) {

      message.channel.send(new RichEmbed()
          .addField(`${bot.user.username} - JavaScript Eval Error:`, "There Was a Problem With The Code That You Are Trying To Run!")
          .addField(":no_entry: ERROR", "```" + clean(err) + "```")
          .setColor(0xFF5733)
          .setFooter(message.createdAt, message.author.avatarURL))

        .catch(error => message.channel.send(`**ERROR:** ${error.message}`));
    }
  }
};