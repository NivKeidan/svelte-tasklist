import { writable } from 'svelte/store';

let lastId = 0;
const removeErrorTimeout = 1000;
const removeMsgTimeout = 1000;
function createUserMessagesStore() {
    const { subscribe, set, update } = writable([]);

    return {
        subscribe,
        addError: (errMsg) => update(messages => {
            removeError(removeErrorTimeout);
            return [...messages, {id: ++lastId, msg: errMsg, error: true}];
        }),
        addMsg: (msg) => update(messages => {
            removeError(removeMsgTimeout);
            return [...messages, {id: ++lastId, msg: msg, error: false}];
        }),
        remove: () => update( messages => messages.filter((a, i) => i > 0))
    };
}

export const userMessages = createUserMessagesStore();

function removeError(timeout) {
    setTimeout(userMessages.remove, timeout);
}