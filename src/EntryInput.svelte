<script>
    import { createEventDispatcher, beforeUpdate } from 'svelte';
    import { getDefaultDate, getDaysFromToday, getDefaultTime } from './utils/time';
    const dispatch = createEventDispatcher();
    let text = "";
    let dateString = "";
    let timeString = "";

    beforeUpdate( () => {
        dateString = extractDate(text);
        timeString = extractTime(text);
    });

    function handleSubmit() {
        if (text !== "") {
            let date = getDefaultDate();
            switch (dateString) {
                case 'today':
                    date = getDaysFromToday(0);
                    break;
                case 'upcoming':
                    date = getDaysFromToday(5);
                    break;
            }

            text = text.replace(dateString, '');
            text = text.replace(timeString, '');

            dispatch('new-entry', {text, date, time: timeString});
            text = "";
            timeString = "";
            dateString = "";
        }
    }

    function extractDate() {
        if (text.includes('today')) {
            return 'today';
        }
        if (text.includes('upcoming')) {
            return 'upcoming';
        }
        return "";
    }

    function extractTime() {
        const regex = RegExp("\\b[0-9]{4}\\b");
        let values = text.match(regex);
        if (values === null)
            return getDefaultTime();
        return values[0];
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
        height: 5vh;
        font-size: 4vh;
    }

    .btn-add {
        margin-left: 1%;
        vertical-align: middle;
        width: 6%;
    }
</style>

<div class="input">
    <div contenteditable="true" bind:textContent={text} class="entry-input"
         on:keydown={handleKeyDown}/>
    <button class="btn-add">Add</button>
</div>