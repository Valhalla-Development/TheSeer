import { dirname, importx } from "@discordx/importer";
import { IntentsBitField, Partials, codeBlock, EmbedBuilder, ChannelType } from "discord.js";
import { Client } from "discordx";
import 'dotenv/config'

export const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildPresences,
    ],
    partials: [Partials.User, Partials.Channel, Partials.GuildMember],
    silent: false,
});

process.on('unhandledRejection', (error: Error) => {
    if (!error.stack) return;

    console.error(error.stack)

    if (process.env.Logging && process.env.Logging.toLowerCase() === 'true') {
        if (!process.env.LoggingChannel) return;

        const channel = client.channels.cache.get(process.env.LoggingChannel);
        if (!channel || channel.type !== ChannelType.GuildText) return;

        const typeOfError = error.stack.split(':')[0];
        const fullError = error.stack.replace(/^[^:]+:/, '').trimStart();
        const timeOfError = `<t:${Math.floor(new Date().getTime() / 1000)}>`;
        const fullString = `From: \`${typeOfError}\`\nTime: ${timeOfError}\n\nError:\n${codeBlock('js', fullError)}`;

        function truncateDescription(description: string) {
            const maxLength = 2048;
            if (description.length > maxLength) {
                const numTruncatedChars = description.length - maxLength;
                return `${description.slice(0, maxLength)}... ${numTruncatedChars} more`;
            }
            return description;
        }

        const embed = new EmbedBuilder().setTitle('Error').setDescription(truncateDescription(fullString));
        channel.send({embeds: [embed]});
    }
})

async function run() {
    const missingTokenError = 'You must pass the token for the client.';
    const invalidLoggingValueError = "The 'logging' value must be true or false.";
    const missingDefaultPermsError = 'You must pass default perm(s) for the Client.';
    const invalidLoggingChannel = 'You must pass a logging channel if logging is set to true.';

    await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

    if (process.env.Logging !== 'true' && process.env.Logging !== 'false') throw new Error(invalidLoggingValueError);
    if (process.env.Logging === 'true' && !process.env.LoggingChannel) throw new Error(invalidLoggingChannel)
    if (!process.env.DefaultPerms) throw new Error(missingDefaultPermsError);
    if (!process.env.Token) throw Error(missingTokenError);

    await client.login(process.env.Token);
}

await run();
