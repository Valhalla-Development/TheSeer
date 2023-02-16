import { dirname, importx } from "@discordx/importer";
import type { Interaction, Message } from "discord.js";
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
    await importx(`${dirname(import.meta.url)}/{Events,Commands}/**/*.{ts,js}`);

    if (!process.env.Token) {
        throw Error("Could not find Token in your environment");
    }

    await bot.login(process.env.Token);
}

run();