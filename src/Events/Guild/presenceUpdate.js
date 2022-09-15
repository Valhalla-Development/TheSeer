import SQLite from 'better-sqlite3';
import { EmbedBuilder } from 'discord.js';
import Event from '../../Structures/Event.js';

const db = new SQLite('./Storage/DB/db.sqlite');

export const EventF = class extends Event {
  // this whole file is just for AirReps!
  async run(oldPresence, newPresence) {
    // Selects table from db, if does not exist, return
    const watchedbots = db.prepare('SELECT * FROM watchedbots WHERE guildid = ?').get(newPresence.guild.id);

    if (!watchedbots) return;

    const offlineEmbed = new EmbedBuilder()
      .setTitle('The Seer Report')
      .setDescription(`<@${newPresence.userId}> is **OFFLINE**`)
      .setColor('#ff2f2f')
      .setTimestamp();

    const onlineEmbed = new EmbedBuilder()
      .setTitle('The Seer Report')
      .setDescription(`<@${newPresence.userId}> is **ONLINE**`)
      .setColor('#27d200')
      .setTimestamp();

    // Status other than offline
    const statusList = ['online', 'idle', 'dnd'];
    let channelid;
    let dmid;

    if (!oldPresence || !oldPresence.status) return;

    if (newPresence.status) {
      if (watchedbots.chanid) {
        // if the channel is present in db, find it
        channelid = this.client.channels.cache.get(watchedbots.chanid);

        if (watchedbots.botid) {
          // there is botid data in db, parse the array
          const foundBotList = JSON.parse(watchedbots.botid);
          // if the presenceUpdate id exists in the db...
          if (foundBotList.includes(newPresence.userId)) {
            // if the status has not changed (this event also monitors activity changes)
            if (oldPresence.status === newPresence.status) return;
            // if the status changed between online, idle or dnd, return
            if (statusList.includes(oldPresence.status) && statusList.includes(newPresence.status)) return;
            // if the status changed to offline
            if (newPresence.status === 'offline') {
              channelid.send({ embeds: [offlineEmbed] });
              if (watchedbots.dmid) dmid.send({ embeds: [offlineEmbed] });
            } else {
              channelid.send({ embeds: [onlineEmbed] });
              if (watchedbots.dmid) dmid.send({ embeds: [onlineEmbed] });
            }
          }
        }
      }
    }
  }
};

export default EventF;
