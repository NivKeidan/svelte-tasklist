<script>
    import {inputAdded} from './utils/forms';
    import {createEventDispatcher} from 'svelte';

    export let data = "";
    let inputValue = "";
    let isEditing = false;
    const dispatch = createEventDispatcher();

    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            cancelEdit();
        }
    }

    function handleClick(e) {
        inputValue = data;
        isEditing = true;
    }

    function cancelEdit() {
        isEditing = false;
    }

    function handleSubmit(e) {
        if (data === inputValue) {
            cancelEdit();
            return
        }
        if (validateInput()) {
            data = inputValue;
            isEditing = false;
            dispatch("time-change", {});
        }
    }

    function validateInput() {
        const regex = RegExp("^[012][0-9][0-5][0-9]$");

        if (!regex.test(inputValue)) {
            console.log("Time Input Error: Use 4 digits in format HHMM");
            return false;
        }

        const hourPart = parseInt(inputValue.substring(0,2));
        const minutesPart = parseInt(inputValue.substring(2));

        if (hourPart > 23) {
            console.log("Time Input Error: Hour not valid");
            return false;
        }

        if (minutesPart > 59) {
            console.log("Time Input Error: Minutes not valid");
            return false;
        }

        return true;


    }
</script>

<style>
    .time {
        color: var(--time-color);
    }

    .edit-time-form {
        display: inline-block;
    }

    .edit-time-input {
        max-width: 6ch;
    }
</style>

{#if isEditing}
    <form on:submit|preventDefault={handleSubmit} class="edit-time-form">
        <input maxlength="4" class="edit-time-input" use:inputAdded bind:value={inputValue} on:keydown={handleKeyDown}
               on:blur={cancelEdit}/>
    </form>
{:else}
    <span class="time" on:click={handleClick}>{data}</span>
{/if}