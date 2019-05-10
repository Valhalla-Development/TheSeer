const {
    RichEmbed
} = require("discord.js");
const {
    ownerid
} = require("../../botconfig.json");
const SQLite = require('better-sqlite3');
const db = new SQLite('./db/db.sqlite');

module.exports = {
    config: {
        name: "add",
        description: "adds a bot to the watchlist",
        usage: "!add <@bot>",
        category: "moderation",
        accessableby: "Staff",
    },
    run: async (bot, message, args) => {

        if ((!message.member.hasPermission("MANAGE_GUILD") && (message.author.id !== ownerid))) {
            message.channel.send(`You need the \`MANAGE_SERVER\` permission to use this command!`).then(msg => {
                msg.delete(10000);
            });
            return;
        }

        if (args[0] === undefined) {
            const noInput = new RichEmbed()
                .setColor(`8e2430`)
                .setDescription(`incorrect usage...`);
            message.channel.send(noInput);
            return;
        }

        let mentionBot = message.mentions.members.first();
        if (mentionBot === undefined) {
            const noMention = new RichEmbed()
                .setColor(`8e2430`)
                .setDescription(`You need to mention a bot!`);
            message.channel.send(noMention).then(msg => {
                msg.delete(10000);
            });
            return;
        }

        if (!mentionBot.user.bot) {
            const notaBot = new RichEmbed()
                .setColor(`8e2430`)
                .setDescription(`The specified user was not a bot!`);
            message.channel.send(notaBot).then(msg => {
                msg.delete(10000);
            });
            return;
        } else {
            const checkExists = db.prepare("SELECT * FROM watchedbots WHERE (guildid, botid) = (guildid, botid);");
            checkExists.get({
                guildid: `${message.guild.id}`,
                botid: `${mentionBot.id}`
            });
            if (checkExists) {
                const alreadyMonit = new RichEmbed()
                    .setColor(`8e2430`)
                    .setDescription(`<@${mentionBot.id}> is already being monitored!`);
                message.channel.send(alreadyMonit).then(msg => {
                    msg.delete(10000);
                });
                return;
            } else {
                const success = new RichEmbed()
                    .setColor(`8e2430`)
                    .setDescription(`<@${mentionBot.id}> is now being monitored :slight_smile:`);
                message.channel.send(success).then(msg => {
                    msg.delete(20000);
                });
                const insert = db.prepare("INSERT INTO watchedbots (guildid, botid) VALUES (@guildid, @botid);");
                insert.run({
                    guildid: `${message.guild.id}`,
                    botid: `${mentionBot.id}`
                });
                return;
            }
        }
    }
};