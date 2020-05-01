<script>
    import { createEventDispatcher } from 'svelte';
    import { getDefaultDate, getDaysFromToday, getDefaultTime } from './utils/time';
    const dispatch = createEventDispatcher();
    let text = "";

    function handleSubmit() {
        if (text !== "") {
            let date = extractDate(text);
            let time = extractTime(text);
            dispatch('new-entry', {text, date, time});
            text = "";
        }
    }

    function extractDate(data) {
        if (data.toLowerCase().includes('today')) {
            return getDefaultDate();
        }
        if (data.toLowerCase().includes('upcoming')) {
            return getDaysFromToday(5);
        }
        return getDefaultDate();
    }

    function extractTime(data) {
        const regex = RegExp("\\b[0-9]{4}\\b");
        let values = data.match(regex);
        if (values === null)
            return getDefaultTime();
        return values[0];
    }

    function isEntryUpcoming(newEntryText) {
        return newEntryText.toLowerCase().includes('upcoming');
    }
</script>

<style>
    .input {
        text-align: center;
    }
    .entry-input {
        width: 50%;
        margin-bottom: 4%;
        margin-top: 1%;
    }
</style>

<div class="input">
    <form on:submit|preventDefault={handleSubmit}>
        <input bind:value={text} class="entry-input"/>
        <button>Add</button>
    </form>
</div>