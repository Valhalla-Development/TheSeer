import { model, Schema } from 'mongoose';

/**
 * Represents a schema for storing information about watched bots in a guild.
 */
const WatchedBots = new Schema({
    GuildId: { type: String, unique: true },
    BotIds: { type: Array, default: null },
    Channel: { type: String, default: null },
    Dm: { type: String, default: null },
});

export default model('WatchedBots', WatchedBots, 'WatchedBots');
