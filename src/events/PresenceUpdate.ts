import type { ArgsOf, Client } from 'discordx';
import { Discord, On } from 'discordx';
import type { TextBasedChannel } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import WatchedBots from '../mongo/schemas/WatchedBots.js';

@Discord()
export class PresenceUpdate {
    /**
     * Listens for presence updates and sends notifications if watched bots' statuses change.
     * @param oldPresence - The presence information before the update.
     * @param newPresence - The presence information after the update.
     * @param client - The Discord client.
     */
    @On({ event: 'presenceUpdate' })
    async onPresenceUpdate([oldPresence, newPresence]: ArgsOf<'presenceUpdate'>, client: Client) {
        const watchedBots = await WatchedBots.findOne({ GuildId: newPresence.guild?.id });
        if (!watchedBots) return;

        const { Channel, Dm, BotIds = [] } = watchedBots;
        if ((!Channel && !Dm) || !BotIds) return;

        const offlineEmbed = new EmbedBuilder()
            .setDescription(`<@${newPresence.userId}> is **OFFLINE**`)
            .setColor('#ff2f2f')
            .setTimestamp();

        const onlineEmbed = new EmbedBuilder()
            .setDescription(`<@${newPresence.userId}> is **ONLINE**`)
            .setColor('#27d200')
            .setTimestamp();

        // Status other than offline
        const statusList = ['online', 'idle', 'dnd'];

        if (!oldPresence?.status || !newPresence?.status || (!Channel && !Dm)) return;

        if (!BotIds.includes(newPresence.userId)) return;

        if (oldPresence.status === newPresence.status || (statusList.includes(oldPresence.status) && statusList.includes(newPresence.status))) return;

        const channel = client.channels.cache.get(Channel) as TextBasedChannel;

        if (newPresence.status === 'offline') {
            channel?.send({ embeds: [offlineEmbed] });
            if (Dm) {
                const user = client.users.cache.get(Dm);
                if (user) {
                    try {
                        await user.send({ embeds: [offlineEmbed] });
                    } catch {
                        await WatchedBots.findOneAndUpdate({ GuildId: newPresence.guild?.id }, { Dm: null });
                    }
                }
            }
        } else {
            channel?.send({ embeds: [onlineEmbed] });
            if (Dm) {
                const user = client.users.cache.get(Dm);
                if (user) {
                    try {
                        await user.send({ embeds: [onlineEmbed] });
                    } catch {
                        await WatchedBots.findOneAndUpdate({ GuildId: newPresence.guild?.id }, { Dm: null });
                    }
                }
            }
        }
    }
}
