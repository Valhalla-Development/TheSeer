const {
    RichEmbed
} = require("discord.js");
const moment = require("moment");

module.exports = {
    config: {
        name: "uptime",
        description: "Displays the bots current uptime!",
        usage: "!uptime",
        category: "miscellaneous",
        accessableby: "Members",
        aliases: ["ut"]
    },
    run: async (bot, message, args) => {
        function convertMS(ms) {
            var d, h, m, s;
            s = Math.floor(ms / 1000);
            m = Math.floor(s / 60);
            s = s % 60;
            h = Math.floor(m / 60);
            m = m % 60;
            d = Math.floor(h / 24);
            h = h % 24;
            return {
                d: d,
                h: h,
                m: m,
                s: s
            };
        }
        let u = convertMS(bot.uptime);
        let uptime =
            u.d +
            " days : " +
            u.h +
            " hours : " +
            u.m +
            " minutes : " +
            u.s +
            " seconds";

        const duration = moment.duration(bot.uptime);
        const botembed = new RichEmbed()
            .setTitle("Uptime")
            .setColor(`RANDOM`)
            .setDescription(`${uptime}`);

        message.channel.send(botembed);
    }
};