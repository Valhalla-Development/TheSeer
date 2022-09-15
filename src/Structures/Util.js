/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import path from 'path';
import { promisify } from 'util';
import { REST, Routes } from 'discord.js';
import glob from 'glob';
import url from 'url';
import chalk from 'chalk';
import Event from './Event.js';
import Command from './Command.js';

const globPromise = promisify(glob);

export const Util = class Util {
  constructor(client) {
    this.client = client;
  }

  isClass(input) {
    return typeof input === 'function' && typeof input.prototype === 'object' && input.toString().substring(0, 5) === 'class';
  }

  get directory() {
    return url.fileURLToPath(new URL('..', import.meta.url));
  }

  removeDuplicates(arr) {
    return [...new Set(arr)];
  }

  capitalise(string) {
    return string
      .split(' ')
      .map((str) => str.slice(0, 1).toUpperCase() + str.slice(1))
      .join(' ');
  }

  color(me) {
    let color;
    if (me === '#000000') {
      color = '#A10000';
    } else {
      color = me;
    }
    return color;
  }

  async loadCommands() {
    const cmds = [];

    return globPromise(`${this.directory}Commands/**/*.js`).then(async (commands) => {
      for (const commandFile of commands) {
        const { name } = path.parse(commandFile);
        const { default: File } = await import(commandFile);
        if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export a class!`);
        const command = new File(this.client, name.toLowerCase());
        if (!(command instanceof Command)) throw new TypeError(`Command ${name} doesn't belong in the Commands directory.`);
        this.client.commands.set(command.name, command);

        cmds.push({
          name: command.name,
          type: command.type ? command.type : 1,
          description: command.description ? command.description : 'No description provided.',
          category: command.category,
          options: command.options ? command.options.options : null,
          userPerms: command.userPerms ? command.userPerms : null,
          botPerms: command.botPerms ? command.botPerms : null
        });
      }

      const rest = new REST({ version: '10' }).setToken(this.client.token);

      (async () => {
        try {
          if (this.client.config.applicationID === '509122286561787904') {
            await rest.put(Routes.applicationGuildCommands(this.client.config.applicationID, this.client.config.supportGuild), { body: cmds });
            console.log(`${chalk.whiteBright('Loaded')} ${chalk.red.bold(`${cmds.length}`)} ${chalk.whiteBright('Commands!')}`);
          } else {
            await rest.put(Routes.applicationCommands(this.client.config.applicationID), { body: cmds });
            console.log(`${chalk.whiteBright('Loaded')} ${chalk.red.bold(`${cmds.length}`)} ${chalk.whiteBright('Commands!')}`);
          }
        } catch (err) {
          console.log(err);
        }
      })();
    });
  }

  async loadEvents() {
    return globPromise(`${this.directory}Events/**/*.js`).then(async (events) => {
      for (const eventFile of events) {
        const { name } = path.parse(eventFile);
        const { default: File } = await import(eventFile);
        if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class!`);
        const event = new File(this.client, name);
        if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belong in the Events directory.`);
        this.client.events.set(event.name, event);
        event.emitter[event.type](name, (...args) => event.run(...args));
      }
    });
  }

  async loadFunctions() {
    this.client.functions = {};
    return globPromise(`${this.directory}Functions/*.js`).then(async (functions) => {
      functions.forEach(async (m) => {
        const { default: File } = await import(m);
        this.client.functions[File.name] = new File(this)[File.name];
      });
    });
  }
};

export default Util;
