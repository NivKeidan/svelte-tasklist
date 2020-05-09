import { writable } from 'svelte/store';

function createErrorsStore() {
    const { subscribe, set, update } = writable([]);

    return {
        subscribe,
        add: (errMsg) => update(errs => {
            console.log(errs);
            removeError(errMsg);
            return [...errs, errMsg];
        }),
        remove: (errMsg) => update( errs => errs.filter(e => e !== errMsg))
    };
}

export const errors = createErrorsStore();

function removeError(errMsg) {
    const removeErrorTimeout = 1000;
    setTimeout(errors.remove, removeErrorTimeout, errMsg);
}