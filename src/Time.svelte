<script>
    import {inputAdded} from './utils/forms';
    import {getDefaultTime} from './utils/time';
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
        if (data === getDefaultTime())
            inputValue = "0000";
        else
            inputValue = data;
        isEditing = true;
    }

    function cancelEdit() {
        isEditing = false;
    }

    function handleSubmit(e) {
        if (data === inputValue) {  // No change
            cancelEdit();
            return
        }
        if (validateInput())
            data = inputValue;
        else if (inputValue === "")
            data = getDefaultTime();
        else
            return;
        isEditing = false;
        dispatch("time-change", {});
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
    {#if data !== getDefaultTime() }
        <span class="time" on:click={handleClick}>{data}</span>
    {:else}
        <span class="time" on:click={handleClick}>---</span>
    {/if}
{/if}