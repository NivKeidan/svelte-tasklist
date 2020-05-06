<script>
    import {inputAdded} from './utils/forms';
    import {NullTime} from './constants';
    import {createEventDispatcher, onMount} from 'svelte';
    import './Time.css';

    export let data = "";
    export let show = true;
    let inputValue = "";
    let isEditing = false;
    const dispatch = createEventDispatcher();

    onMount( async () => {
        if (data === NullTime)
            show = false;
    });

    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            cancelEdit();
        }
    }

    function handleClick(e) {
        if (data === NullTime)
            inputValue = "0000";
        else
            inputValue = data;
        isEditing = true;
    }

    function cancelEdit() {
        isEditing = false;
    }

    function handleSubmit(e) {
        if (inputValue === data) {  // No change
            cancelEdit();
        }
        else if (inputValue === "")     // hide time
            show = false;
        else if (validateInput()) {  // accept input
            show = true;
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

{#if isEditing}
    <form on:submit|preventDefault={handleSubmit} class="edit-time-form">
        <input maxlength="4" class="edit-time-input" use:inputAdded bind:value={inputValue} on:keydown={handleKeyDown}
               on:blur={cancelEdit}/>
    </form>
{:else}
    {#if show }
        <span class="time" on:click={handleClick}>{data}</span>
    {:else}
        <span class="time" on:click={handleClick}>---</span>
    {/if}
{/if}