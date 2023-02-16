export function deletableCheck(message, time) {
    setTimeout(() => {
        if (message && message.deletable) {
            message.delete();
        }
    }, time);
}