module.exports = {
    config: {
        name: "ping",
        description: "PONG! Displays the api & bot latency",
        usage: "!ping",
        category: "miscellaneous",
        accessableby: "Members"
    },
    run: async (bot, message, args) => {

        let pingMessage = ":ping_pong: **| Pong! My ping is: ${ping} ms**";
        const ping = pingMessage.replace("${ping}", Math.round(bot.ping));

        message.channel.send(`${ping}`);
    }
};