import SQLite from 'better-sqlite3';
import chalk from 'chalk';
import { ActivityType } from 'discord.js';
import si from 'systeminformation';
import Event from '../../Structures/Event.js';

import * as packageFile from '../../../package.json' assert { type: 'json' };

const pckg = packageFile.default;

const db = new SQLite('./Storage/DB/db.sqlite');

export const EventF = class extends Event {
  constructor(...args) {
    super(...args, {
      once: true
    });
  }

  async run() {
    const red = '\x1b[31m';
    const magenta = '\x1b[35m';
    const white = '\x1b[37m';
    const green = '\x1b[32m';
    const yellow = '\x1b[33m';
    const blue = '\x1b[34m';
    const underline = '\x1b[4m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';

    // Bot Info
    console.log(`\n——————————[${this.client.user.username} Info]——————————`.replace(/(^\n.*$)/g, `${red + bold}$1${reset}`));
    console.log(
      `Users: ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString('en')}`
        .replace(/(Users: )/, `${white + bold}$1${yellow}`)
        .concat(reset)
    );
    console.log(`Guilds: ${this.client.guilds.cache.size.toLocaleString('en')}`.replace(/(Guilds: )/, `${white + bold}$1${yellow}`).concat(reset));
    console.log(`Slash Commands: ${this.client.commands.size}`.replace(/(Slash Commands: )/, `${white + bold}$1${yellow}`).concat(reset));
    console.log(`Events: ${this.client.events.size}`.replace(/(Events: )/, `${white + bold}$1${yellow}`).concat(reset));
    console.log(
      `Invite: https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot%20applications.commands&permissions=415306870006`
        .replace(/(Invite: )/, `${white + bold}$1${blue}${underline}`)
        .concat(reset)
    );

    // Bot Specs
    console.log(`\n——————————[${this.client.user.username} Specs]——————————`.replace(/(^\n.*$)/g, `${red + bold}$1${reset}`));
    console.log(
      `Running Node: ${process.version} on ${process.platform} ${process.arch}`
        .replace(/(Running Node: )/, `${white + bold}$1${magenta}${bold}`)
        .replace(/( on )/, `${white + bold}$1${magenta}${bold}`)
        .concat(reset)
    );

    const memory = await si.mem();
    const totalMemory = Math.floor(memory.total / 1024 / 1024);
    const cachedMem = memory.buffcache / 1024 / 1024;
    const memoryUsed = memory.used / 1024 / 1024;
    const realMemUsed = Math.floor(memoryUsed - cachedMem);

    console.log(
      `Memory: ${realMemUsed.toLocaleString('en')} / ${totalMemory.toLocaleString('en')} MB`
        .replace(/(Memory: )/, `${white + bold}$1${yellow}${bold}`)
        .replace(/( \/ )/, `${white + bold}$1${yellow}${bold}`)
        .replace(/(MB)/, `${white + bold}$1`)
        .concat(reset)
    );
    console.log(
      `Discord.js Verion: ${pckg.dependencies['discord.js'].substring(1)}`
        .replace(/(Discord.js Verion: )/, `${white + bold}$1${green}${bold}`)
        .concat(reset)
    );
    console.log(
      `${this.client.user.username} Version: ${pckg.dependencies['discord.js'].substring(1)}\n`
        .replace(/(^.*)/, `${white + bold}$1${reset}`)
        .replace(/(: )/, `${white + bold}$1${magenta}${bold}`)
        .concat(reset)
    );

    // Watched Bots Table
    const watchedBots = db.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'watchedbots';").get();
    if (!watchedBots['count(*)']) {
      console.log('Watched Bots Table Created!');
      db.prepare('CREATE TABLE watchedbots (guildid TEXT, botid TEXT, chanid TEXT, dmid TEXT);').run();
      db.prepare('CREATE UNIQUE INDEX idx_watchedbots_id ON watchedbots (guildid);').run();
      db.pragma('synchronous = 1');
      db.pragma('journal_mode = wal');
    }

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
  }
};

export default EventF;
