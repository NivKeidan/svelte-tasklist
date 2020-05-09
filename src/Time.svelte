<script>
    import {inputAdded} from './utils/forms';
    import { errors } from './stores.js';
    import {createEventDispatcher} from 'svelte';
    import * as timeUtils from './utils/time';
    import './Time.css';
    import TimeIcon from './IconTime.svelte';

    export let data = "";
    let inputValue = "";
    let isEditing = false;
    const dispatch = createEventDispatcher();

    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            cancelEdit();
        }
    }

    function handleClick() {
        if (timeUtils.isAutoSetTime(data))
            inputValue = "0000";
        else
            inputValue = data;
        isEditing = true;
    }

    function cancelEdit() {
        isEditing = false;
    }

    function handleSubmit() {
        if (inputValue === data) {  // No change
            cancelEdit();
        }
        else if (inputValue === "")
            data = timeUtils.convertToAuto(data)// hide time
        else if (validateInput()) {  // accept input
            data = inputValue;
        }
        else  // invalid input
            return;
        isEditing = false;
        dispatch("time-change", {});
    }

    function validateInput() {
        const regex = RegExp("^[012][0-9][0-5][0-9]$");

        if (!regex.test(inputValue)) {
            errors.add("Time Input Error");
            return false;
        }

        const hourPart = parseInt(inputValue.substring(0,2));
        const minutesPart = parseInt(inputValue.substring(2));

        if (hourPart > 23) {
            errors.add("Time Input Error: Hour not valid");
            return false;
        }

        if (minutesPart > 59) {
            errors.add("Time Input Error: Minutes not valid");
            return false;
        }
        return true;
    }

    function getDisplay() {
        return timeUtils.getDisplayString(data);
    }
</script>

{#if isEditing}
    <form on:submit|preventDefault={handleSubmit} class="edit-time-form">
        <input maxlength="4" class="edit-time-input" use:inputAdded bind:value={inputValue} on:keydown={handleKeyDown}
               on:blur={cancelEdit}/>
    </form>
{:else}
    {#if !timeUtils.isAutoSetTime(data) }
        <span class="time" on:click={handleClick}>{getDisplay()}</span>
    {:else}
        <span on:click={handleClick}><TimeIcon/></span>
    {/if}
{/if}