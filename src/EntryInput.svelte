<script>
    import { createEventDispatcher, afterUpdate } from 'svelte';
    import { analyzeDateString, analyzeTimeString, DATE_REGEX, TIME_REGEX } from './utils/time';
    import './EntryInput.css';

    const dispatch = createEventDispatcher();
    let text = "";
    let dateStrings = [];
    let timeStrings = [];
    let selectedTimeIndex = 0;
    let selectedDateIndex = 0;

    afterUpdate( () => {
        dateStrings = extractDateStrings(text);
        timeStrings = extractTimeStrings(text);
    });

    function handleSubmit() {
        if (text !== "") {
            let date = analyzeDateString(dateStrings[selectedDateIndex]);
            if (date === "") { // error
                return;
            }
            let time = analyzeTimeString(timeStrings[selectedTimeIndex]);

            text = text.replace(dateStrings[selectedDateIndex], '');
            text = text.replace(timeStrings[selectedTimeIndex], '');

            dispatch('new-entry', {text, date, time});
            text = "";
            selectedTimeIndex = 0;
            selectedDateIndex = 0;
        }
    }

    function extractDateStrings() {
        let values = text.match(DATE_REGEX);
        if (values === null)
            return [];
        else
            return values;
    }

    function extractTimeStrings() {
        let values = text.match(TIME_REGEX);
        if (values === null)
            return [];
        else
            return values;
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            handleSubmit();
            e.preventDefault();
        }

    }

</script>

<div class="input" on:keydown={handleKeyDown}>
    <span class="inputs-found">
        {#each dateStrings as ds, i}
            <span class="input-date" class:date-selected="{i == selectedDateIndex}" on:click="{e => selectedDateIndex = i}">{ds}</span>
        {/each}

        {#each timeStrings as ts, i}
            <span class="input-time" class:time-selected="{i == selectedTimeIndex}" on:click="{e => selectedTimeIndex = i}">{ts}</span>
        {/each}
    </span>
    <input bind:value={text} class="entry-input"/>
    <button class="btn-add" on:click={handleSubmit}>Add</button>
</div>