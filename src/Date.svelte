<script>
    import {inputAdded} from './utils/forms';
    import {SHOW_DATE} from './utils/constants';
    import { createEventDispatcher } from 'svelte';
    import { getDayName, breakApart } from './utils/time';
    import './Date.css';
    import DateIcon from './IconDate.svelte';

    export let data = "";
    export let changeable = true;
    export let show = SHOW_DATE.FULL;
    let inputValue = "";
    let isEditing = false;
    const dispatch = createEventDispatcher();

    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            cancelEdit();
        }
    }

    function handleClick() {
        if (changeable) {
            inputValue = data;
            isEditing = true;
        }
    }

    function cancelEdit() {
        isEditing = false;
    }

    function handleSubmit() {
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

    function getDisplayDate() {
        let dateParts = breakApart(data);
        let currentYear =  new Date().getFullYear();
        let finalString =  dateParts.day + "." + dateParts.month;
        if (parseInt(dateParts.year) !== currentYear) {
            finalString = finalString + "." + dateParts.year.substring(2);
        }
        return finalString;
    }

</script>

{#if isEditing}
    <form on:submit|preventDefault={handleSubmit} class="edit-date-form">
        <input maxlength="8" class="edit-date-input" use:inputAdded bind:value={inputValue} on:keydown={handleKeyDown}
            on:blur={cancelEdit}/>
    </form>
{:else}
    <span class="date" on:click={handleClick}>
        {#if show === SHOW_DATE.FULL}
            {getDisplayDate()}
        {:else if show === SHOW_DATE.DAY}
            {getDayName(data)}
        {:else if show === SHOW_DATE.ICON}
            <DateIcon/>
        {/if}
    </span>
{/if}