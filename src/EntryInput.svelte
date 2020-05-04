<script>
    import { createEventDispatcher, afterUpdate } from 'svelte';
    import { analyzeDateString, analyzeTimeString, DATE_REGEX, TIME_REGEX } from './utils/time';
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

<style>
    .input {
        text-align: center;
        margin-top: 2%;
        margin-bottom: 3%;
    }

    .entry-input {
        border: 1px solid darkgray;
        box-shadow: 1px 1px 1px 0 lightgray inset;
        width: 50%;
        left: 22%;
        display: inline-block;
        height: 6vh;
        font-size: 5vh;
    }

    .btn-add {
        margin-left: 1%;
        vertical-align: middle;
        width: 6%;
    }

    .input-date {
        background-color: var(--date-color);
        font-weight: bold;
        font-size: large;
        padding: 3px;
        margin: 1px;
    }

    .input-time {
        font-weight: bold;
        background-color: var(--time-color);
        font-size: large;
        padding: 3px;
        margin: 1px;
    }

    .inputs-found span:empty
    {
        display:none;
    }


    .inputs-found {
        display: inline-block;
    }

    .time-selected {
        border: var(--date-color) 3px solid;
    }

    .date-selected {
        border: var(--time-color) 3px solid;
    }

</style>

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