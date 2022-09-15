import SQLite from 'better-sqlite3';
import chalk from 'chalk';
import { ActivityType } from 'discord.js';
import Event from '../../Structures/Event.js';

const db = new SQLite('./Storage/DB/db.sqlite');

export const EventF = class extends Event {
  constructor(...args) {
    super(...args, {
      once: true
    });
  }

  run() {
    console.log(
      [
        `${chalk.whiteBright('Logged in as')} ${chalk.red.bold.underline(`${this.client.user.tag}`)}`,
        `${chalk.whiteBright('Loaded')} ${chalk.red.bold(`${this.client.events.size}`)} ${chalk.whiteBright('events!')}`,
        `${chalk.whiteBright('I am currently in')} ${chalk.red.bold(`${this.client.guilds.cache.size.toLocaleString('en')}`)} ${chalk.whiteBright(
          'guilds!'
        )}`,
        `${chalk.whiteBright('I currently serve')} ${chalk.red.bold(
          `${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString('en')}`
        )} ${chalk.whiteBright('users!')}`,
        '\u3000',
        `Scanning for guilds...\n\x1b[31m[-]\x1b[0m ${this.client.guilds.cache
          .map((n) => `${n.name} (ID: \x1b[31m${n.id}\x1b[0m)`)
          .join('\x1b[31m\n[-]\x1b[0m ')}`
      ].join('\n')
    );

    setTimeout(() => {
      console.log(
        `Invite link: ${chalk.blue.bold.underline(
          `https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=2050485471`
        )}\n`
      );
    }, 1000);

    // Watched Bots Table
    const watchedBots = db.prepare('SELECT count(*) FROM sqlite_master WHERE type=\'table\' AND name = \'watchedbots\';').get();
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
