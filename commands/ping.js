const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {

    message.delete(0);
    const ping = Math.round(client.ping);

    let embed = new Discord.RichEmbed()
        .setColor('36393F')
        .setDescription(`:ping_pong: **| Pong! My ping is: ${ping} ms**`);
    message.channel.send(embed);

};
module.exports.help = {
    name: "ping"
};