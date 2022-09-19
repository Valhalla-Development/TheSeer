import { Client, Collection, PermissionsBitField, GatewayIntentBits, Partials, codeBlock } from 'discord.js';
import Util from './Util.js';

export const TheSeerClient = class TheSeerClient extends Client {
  constructor(options = {}) {
    super({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildPresences],
      partials: [Partials.User, Partials.Channel, Partials.GuildMember]
    });
    this.validate(options);

    this.commands = new Collection();

    this.events = new Collection();

    this.utils = new Util(this);

    this.config = options;

    // Error function for notifiers
    function sendError(client, message) {
      const channel = client.channels.cache.get('685973401772621843');
      if (!channel) return;

      channel.send(codeBlock('js', message));
    }

    process.on('unhandledRejection', (error) => {
      console.error(error);
      sendError(this, error.stack);
    });
  }

  validate(options) {
    if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

    if (!options.token) throw new Error('You must pass the token for the client.');
    this.token = options.token;

    if (options.logging !== true && options.logging !== false) throw new Error('The \'logging\' value must be true or false.');
    this.logging = options.logging;

    if (!options.defaultPerms) throw new Error('You must pass default perm(s) for the Client.');
    this.defaultPerms = new PermissionsBitField(options.defaultPerms).freeze();
  }

  async start(token = this.token) {
    await this.utils.loadCommands();
    await this.utils.loadEvents();
    await super.login(token);
  }
};

export default TheSeerClient;
