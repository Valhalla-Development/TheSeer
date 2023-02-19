import type { Message } from 'discord.js';

export function deletableCheck(message: Message, time: number): void {
    setTimeout(() => {
        if (message && message.deletable) {
            message.delete().catch(console.error);
        }
    }, time);
}

export function capitalise(string: string) {
    return string.replace(/\S+/g, (word) => word.slice(0, 1).toUpperCase() + word.slice(1));
}
