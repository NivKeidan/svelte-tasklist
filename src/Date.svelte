<script>
    import {inputAdded} from './utils/forms';
    import { createEventDispatcher } from 'svelte';
    import { getDayName } from './utils/time';

    export let data = "";
    export let useDayName;
    let inputValue = "";
    let isEditing = false;
    const dispatch = createEventDispatcher();

    getDayName(data);

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
            dispatch('date-change', {newDate: inputValue});
        }
    }

    function validateInput() {
        const regex = RegExp("^[0-9]{8}$");

        if (!regex.test(inputValue)) {
            console.log("Date Input Error: Use 8 digits in format YYYYMMDD");
            return false;
        }

        const monthPart = parseInt(inputValue.substring(4,6));
        const dayPart = parseInt(inputValue.substring(6));

        if (monthPart === 0 || monthPart > 12) {
            console.log("Date Input Error: Month not valid");
            return false;
        }

        if (dayPart === 0 || dayPart > 31) {
            console.log("Date Input Error: Day not valid");
            return false;
        }

        return true;


    }
</script>

<style>
    .date {
        color: var(--date-color);
    }

    .edit-date-form {
        display: inline-block;
    }

    .edit-date-input {
        max-width: 10ch;
    }
</style>

{#if isEditing}
    <form on:submit|preventDefault={handleSubmit} class="edit-date-form">
        <input maxlength="8" class="edit-date-input" use:inputAdded bind:value={inputValue} on:keydown={handleKeyDown}
            on:blur={cancelEdit}/>
    </form>
{:else}
    <span class="date" on:click={handleClick}>
        {#if useDayName}
            {getDayName(data)}
        {:else}
            {data}
        {/if}
    </span>
{/if}