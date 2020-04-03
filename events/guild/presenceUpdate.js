/* eslint-disable max-len */
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

  const statusList = ['online', 'idle', 'dnd'];
  let channelid;
  let dmid;

  if (watchedbots.chanid) {
    channelid = bot.channels.cache.find((a) => a.id === watchedbots.chanid);
    if (watchedbots.botid) {
      const foundBotList = JSON.parse(watchedbots.botid);
      if (foundBotList.includes(newPresence.userID)) {
        if (oldPresence.status === newPresence.status) return;
        if (statusList.includes(oldPresence.status) && statusList.includes(newPresence.status)) return;
        if (newPresence.status === 'offline') {
          channelid.send(offlineEmbed);
        } else {
          channelid.send(onlineEmbed);
        }
      }
    }
  }
  if (watchedbots.dmid) {
    const foundBotList = JSON.parse(watchedbots.botid);
    if (foundBotList.includes(newPresence.userID)) {
      if (oldPresence.status === newPresence.status) return;
      if (statusList.includes(oldPresence.status) && statusList.includes(newPresence.status)) return;
      dmid = bot.users.cache.find((a) => a.id === watchedbots.dmid);
      if (newPresence.status === 'offline') {
        dmid.send(offlineEmbed);
      } else {
        dmid.send(onlineEmbed);
      }
    }
  }
};
