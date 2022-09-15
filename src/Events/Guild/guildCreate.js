import { EmbedBuilder, ChannelType, PermissionsBitField, ActivityType } from 'discord.js';
import SQLite from 'better-sqlite3';
import Event from '../../Structures/Event.js';

const db = new SQLite('./Storage/DB/db.sqlite');

export const EventF = class extends Event {
  async run(guild) {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);

    // activity
    const activityGrab = db.prepare('SELECT botid FROM watchedbots').all();
    let count = 0;
    let dbdata;
    for (dbdata of activityGrab) {
      if (dbdata.botid) {
        const arr = dbdata.botid.slice(1, dbdata.botid.length - 1).split(',');
        count += arr.length;
      }
    }

    this.client.user.setActivity(`${count.toLocaleString('en')} Bots Across ${this.client.guilds.cache.size.toLocaleString('en')} Guilds`, {
      type: ActivityType.Watching
    });

    let defaultChannel = '';

    const genChan = guild.channels.cache.find((chan) => chan.name === 'general');
    if (genChan) {
      defaultChannel = genChan;
    } else {
      guild.channels.cache.forEach((channel) => {
        if (channel.type === ChannelType.GuildText && defaultChannel === '') {
          if (channel.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.SendMessages)) {
            defaultChannel = channel;
          }
        }
      });
    }

    if (defaultChannel === '') {
      return;
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${guild.name}`,
        iconURL: guild.iconURL({ extension: 'png' })
      })
      .setColor(this.client.utils.color(guild.members.me.displayHexColor))
      .setTitle(`Hello, I'm **${this.client.user.username}**! Thanks for inviting me!`)
      .setDescription('To get started, you can run `/help`.\nIf you find any bugs, or have a suggestion, please use: `/suggest <message>`');
    defaultChannel.send({ embeds: [embed] });
  }
};

export default EventF;
