import { writable } from 'svelte/store';

let lastId = 0;
const removeErrorTimeout = 1000;
function createErrorsStore() {
    const { subscribe, set, update } = writable([]);

    return {
        subscribe,
        add: (errMsg) => update(errs => {
            removeError();
            return [...errs, {id: ++lastId, msg: errMsg}];
        }),
        remove: () => update( errs => errs.filter((a, i) => i > 0))
    };
}

export const errors = createErrorsStore();

function removeError() {
    setTimeout(errors.remove, removeErrorTimeout);
}