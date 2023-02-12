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
    const invalidOptionsTypeError = 'Options should be a type of Object.';
    const missingTokenError = 'You must pass the token for the client.';
    const invalidLoggingValueError = 'The \'logging\' value must be true or false.';
    const missingDefaultPermsError = 'You must pass default perm(s) for the Client.';

    if (typeof options !== 'object') throw new TypeError(invalidOptionsTypeError);

    if (!options.Token) throw new Error(missingTokenError);
    this.Token = options.Token;

    if (options.Logging !== 'true' && options.Logging !== 'false') throw new Error(invalidLoggingValueError);
    this.Logging = options.Logging;

    if (!options.DefaultPerms) throw new Error(missingDefaultPermsError);
    const defaultPerms = options.DefaultPerms.split(',');
    this.DefaultPerms = new PermissionsBitField(defaultPerms).freeze();
  }

  async start(token = this.Token) {
    await this.utils.loadCommands();
    await this.utils.loadEvents();
    await super.login(token);
  }
};

export default TheSeerClient;
