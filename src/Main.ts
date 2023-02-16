import { dirname, importx } from "@discordx/importer";
import { IntentsBitField, Partials } from "discord.js";
import { Client } from "discordx";
import 'dotenv/config'

export const bot = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildPresences,
    ],
    partials: [Partials.User, Partials.Channel, Partials.GuildMember],
    silent: false,
});

async function run() {
    const missingTokenError = 'You must pass the token for the client.';
    const invalidLoggingValueError = "The 'logging' value must be true or false.";
    const missingDefaultPermsError = 'You must pass default perm(s) for the Client.';

    await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

    if (process.env.Logging !== 'true' && process.env.Logging !== 'false') throw new Error(invalidLoggingValueError);
    if (!process.env.DefaultPerms) throw new Error(missingDefaultPermsError);
    if (!process.env.Token) throw Error(missingTokenError);

    await bot.login(process.env.Token);
}

await run();
