const { MessageEmbed } = require('discord.js');
const SQLite = require('better-sqlite3');

const db = new SQLite('./db/db.sqlite');

module.exports = async (bot, oldPresence, newPresence) => {
  const watchedbots = db.prepare('SELECT * FROM watchedbots WHERE guildid = ?').get(newPresence.guild.id);
  if (!watchedbots) {
    return;
  }
  const offlineEmbed = new MessageEmbed()
    .setTitle('The Seer Report')
    .setDescription(`<@${newPresence.userID}> is **OFFLINE**`)
    .setColor('#ff2f2f')
    .setTimestamp();

  const onlineEmbed = new MessageEmbed()
    .setTitle('The Seer Report')
    .setDescription(`<@${newPresence.userID}> is **ONLINE**`)
    .setColor('#27d200')
    .setTimestamp();

  if (oldPresence.status === newPresence.status) return;

  const statusList = ['online', 'idle', 'dnd'];
  if (statusList.includes(oldPresence.status) && statusList.includes(newPresence.status)) return;
  console.log(statusList.includes(oldPresence.status) && statusList.includes(newPresence.status));
  let botid;
  let channelid;
  let dmid;
  if (watchedbots.botid) botid = watchedbots.botid;
  if (watchedbots.chanid) {
    channelid = bot.channels.cache.find((a) => a.id === watchedbots.chanid);
    if (newPresence.userID === botid) {
      if (newPresence.status === 'offline') {
        channelid.send(offlineEmbed);
      } else {
        channelid.send(onlineEmbed);
      }
    }
  }
  if (watchedbots.dmid) {
    if (newPresence.userID === botid) {
      dmid = bot.users.cache.find((a) => a.id === watchedbots.dmid);
      if (newPresence.status === 'offline') {
        dmid.send(offlineEmbed);
      } else {
        dmid.send(onlineEmbed);
      }
    }
  }
};