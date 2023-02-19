import { model, Schema } from 'mongoose';

const WatchedBots = new Schema({
    GuildId: { type: String, unique: true },
    BotIds: Array,
    Channel: String,
    Dm: String,
});

export default model('WatchedBots', WatchedBots, 'WatchedBots');
