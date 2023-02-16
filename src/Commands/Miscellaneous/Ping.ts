import type { Client } from 'discordx';
import type { CommandInteraction } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { Category } from '@discordx/utilities';
import { deletableCheck } from '../../Utils/Util.js';

@Discord()
@Category('Miscellaneous')
export class Ping {
    @Slash({ description: 'Displays bot and API ping.' })
    async ping(interaction: CommandInteraction, client: Client) {
        console.log(deletableCheck)
        if (!interaction.channel) return;

        const msg = await interaction.channel.send({ content: 'Pinging...' });
        const latency = msg.createdTimestamp - interaction.createdTimestamp;
        //deletableCheck(msg, 0);

        const embed = new EmbedBuilder().addFields([
            {
                name: `**${client.user?.username} - Ping**`,
                value: `**◎ Bot Latency:** \`${latency}ms\`
          **◎ API Latency:** \`${Math.round(client.ws.ping)}ms\``
            }
        ]);

        await interaction.reply({embeds: [embed]});
    }
}
