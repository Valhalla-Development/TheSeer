const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {

    const undeembed = new Discord.RichEmbed()
        .setColor(0xCF40FA)
        .addField(`The Seer - Available Commands`, `[${prefix}bot add]() : Adds a bot to the watchlist\n[${prefix}bot remove]() : Removes a bot from the watchlist`);
    message.channel.send({
        embed: undeembed
    });
    return;
};
module.exports.help = {
    name: "help"
};