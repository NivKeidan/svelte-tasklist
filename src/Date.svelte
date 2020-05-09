<script>
    import {inputAdded} from './utils/forms';
    import {SHOW_DATE} from './utils/constants';
    import { createEventDispatcher } from 'svelte';
    import * as dateUtils from './utils/date';
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
            return;
        }
        let date = dateUtils.analyzeDateString(inputValue);
        if (date === "" || !dateUtils.validateFullDateString(date)) {
            console.log("Invalid Date Input")
            return;
        }

        data = date;
        isEditing = false;
        dispatch('date-change', {newDate: inputValue});
    }

</script>

{#if isEditing}
    <form on:submit|preventDefault={handleSubmit} class="edit-date-form">
        <input class="edit-date-input" use:inputAdded bind:value={inputValue} on:keydown={handleKeyDown}
            on:blur={cancelEdit}/>
    </form>
{:else}
    <span class="date" on:click={handleClick}>
        {#if show === SHOW_DATE.FULL}
            {dateUtils.getDisplayDate(data)}
        {:else if show === SHOW_DATE.DAY}
            {dateUtils.getDayName(data)}
        {:else if show === SHOW_DATE.ICON}
            <DateIcon/>
        {/if}
    </span>
{/if}