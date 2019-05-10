module.exports = {
    config: {
        name: "ping",
        description: "PONG! Displays the api & bot latency",
        usage: "!ping",
        category: "miscellaneous",
        accessableby: "Members"
    },
    run: async (bot, message, args) => {

        let pingMessage = language.ping.ping;
        const ping = pingMessage.replace("${ping}", Math.round(client.ping));

        message.channel.send(`${ping}`);
    }
};