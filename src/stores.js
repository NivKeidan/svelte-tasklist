import { writable } from 'svelte/store';

let lastId = 0;
const removeErrorTimeout = 1000;
const removeMsgTimeout = 1000;
function createErrorsStore() {
    const { subscribe, set, update } = writable([]);

    return {
        subscribe,
        addError: (errMsg) => update(errs => {
            removeError(removeErrorTimeout);
            return [...errs, {id: ++lastId, msg: errMsg, error: true}];
        }),
        addMsg: (errMsg) => update(errs => {
            removeError(removeMsgTimeout);
            return [...errs, {id: ++lastId, msg: errMsg, error: false}];
        }),
        remove: () => update( errs => errs.filter((a, i) => i > 0))
    };
}

export const errors = createErrorsStore();

function removeError(timeout) {
    setTimeout(errors.remove, timeout);
}