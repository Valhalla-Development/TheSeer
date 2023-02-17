import type { Client, ArgsOf } from 'discordx';
import { Discord, On } from 'discordx';
import {ChannelType, codeBlock, EmbedBuilder} from 'discord.js';
import moment from "moment";

@Discord()
export class InteractionCreate {
    @On({ event: 'interactionCreate' })
    async onInteraction([interaction]: ArgsOf<"interactionCreate">, client: Client) {
        if (!interaction.guild) return;

        await client.executeInteraction(interaction);

        if (process.env.Logging && process.env.Logging.toLowerCase() === 'true') {
            const nowInMs = Date.now();
            const nowInSecond = Math.round(nowInMs / 1000);

            const logEmbed = new EmbedBuilder().setColor('#e91e63');

            logEmbed.addFields({
                name: `Guild: ${interaction.guild.name} | Date: <t:${nowInSecond}>`,
                value: codeBlock('kotlin', `'${interaction.toString()}' Command was executed by ${interaction.user.tag}`)
            });
            const LoggingNoArgs = `[\x1b[31m${moment().format(
                'LLLL'
            )}\x1b[0m] '\x1b[92m${interaction.toString()}\x1b[0m' Command was executed by \x1b[31m${interaction.user.tag}\x1b[0m (Guild: \x1b[31m${
                interaction.guild.name
            }\x1b[0m)`;
            console.log(LoggingNoArgs);

            //! Create .env variable for command logging
            //const channel = client.channels.cache.get('978272607990321152');
            //if (channel && channel.type === ChannelType.GuildText) channel.send({ embeds: [logEmbed] })
        }
    }
}
