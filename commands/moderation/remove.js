const {
    RichEmbed
} = require("discord.js");
const {
    ownerid
} = require("../../botconfig.json");
const {
    prefix
} = require("../../botconfig.json");
const SQLite = require('better-sqlite3');
const db = new SQLite('./db/db.sqlite');

module.exports = {
    config: {
        name: "remove",
        description: "remove a bot from the watchlist",
        usage: "!remove <@bot>",
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
                .setDescription(`Incorrect usage! Correct usage: \`${prefix}remove <@bot>\``);
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

        if (mentionBot.id === '559113940919910406') {
            const notMe = new RichEmbed()
                .setColor(`8e2430`)
                .setDescription(`I can not monitor myself! :slight_frown:`);
            message.channel.send(notMe).then(msg => {
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
            const checkExists = db.prepare(`SELECT count(*) FROM watchedbots WHERE (guildid, botid) = (${message.guild.id}, ${mentionBot.id});`).get();
            if (!checkExists['count(*)']) {
                const alreadyMonit = new RichEmbed()
                    .setColor(`8e2430`)
                    .setDescription(`<@${mentionBot.id}> is not being monitored!`);
                message.channel.send(alreadyMonit).then(msg => {
                    msg.delete(10000);
                });
                return;
            } else {
                const success = new RichEmbed()
                    .setColor(`8e2430`)
                    .setDescription(`<@${mentionBot.id}> has been removed from the watchlist :slight_smile:`);
                message.channel.send(success).then(msg => {
                    msg.delete(20000);
                });
                const remove = db.prepare("DELETE FROM watchedbots WHERE (guildid, botid) = (@guildid, @botid);");
                remove.run({
                    guildid: `${message.guild.id}`,
                    botid: `${mentionBot.id}`
                });
                return;
            }
        }
    }
};