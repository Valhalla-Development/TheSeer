export function deletableCheck(message, time) {
    setTimeout(() => {
        if (message && message.deletable) {
            message.delete();
        }
    }, time);
}

export function capitalise(string) {
    return string.replace(/\S+/g, (word) => word.slice(0, 1).toUpperCase() + word.slice(1));
}
