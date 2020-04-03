/* eslint-disable max-len */
const { MessageEmbed } = require('discord.js');
const SQLite = require('better-sqlite3');

const db = new SQLite('./db/db.sqlite');

module.exports = async (bot, oldPresence, newPresence) => {
  const watchedbots = db.prepare('SELECT * FROM watchedbots WHERE guildid = ?').get(newPresence.guild.id); // Selects table from db, if does not exist, return
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

  const statusList = ['online', 'idle', 'dnd']; // Status other than offline
  let channelid;
  let dmid;

  if (watchedbots.chanid) {
    channelid = bot.channels.cache.find((a) => a.id === watchedbots.chanid); // if the channel is present in db, find it
    if (watchedbots.botid) {
      const foundBotList = JSON.parse(watchedbots.botid); // there is botid data in db, parse the array
      if (foundBotList.includes(newPresence.userID)) { // if the presenceUpdate id exists in the db...
        if (oldPresence.status === newPresence.status) return; // if the status has not changed (this event also monitors activity changes)
        if (statusList.includes(oldPresence.status) && statusList.includes(newPresence.status)) return; // if the status changed between online, idle or dnd, return
        if (newPresence.status === 'offline') { // if the status changed to offline
          channelid.send(offlineEmbed);
        } else { // if it changed to online
          channelid.send(onlineEmbed);
        }
      }
    }
  }
  if (watchedbots.dmid) { // if dmid data in db
    const foundBotList = JSON.parse(watchedbots.botid); // parse the data
    if (foundBotList.includes(newPresence.userID)) { // if the presenceUpdate id exists in the db
      if (oldPresence.status === newPresence.status) return; // if the status has not changed (this event also monitors activity changes)
      if (statusList.includes(oldPresence.status) && statusList.includes(newPresence.status)) return; // if the status changed between online, idle or dnd, return
      dmid = bot.users.cache.find((a) => a.id === watchedbots.dmid); // if the dmid is present in db, find it
      if (newPresence.status === 'offline') { // if the status changed to offline
        dmid.send(offlineEmbed);
      } else { // if the status changed to online
        dmid.send(onlineEmbed);
      }
    }
  }
};
