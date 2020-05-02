<script>
    import { createEventDispatcher } from 'svelte';
    import Date from './Date.svelte';
    import Time from './Time.svelte';
    import {inputAdded} from './utils/forms';
    import {getDefaultDate, getDefaultTime} from './utils/time';

    const dispatch = createEventDispatcher();
    export let content = "This entry has no content wtf?!?!";
    export let date = getDefaultDate();
    export let time = getDefaultTime();
    export let id = 0;
    export let useDayNames = false;
    export let showDate = true;
    export let showTime = true;
    export let oneLiner = false;
    let previous = "";
    let isEditing = false;
    let isDragged = false;

    function handleDateChanged(e) {
        dispatch('date-change', {entryId: id})
    }

    function handleRemove() {
        dispatch('remove-entry', {id: id});
    }

    function handleEdit() {
        previous = content;
        isEditing = true;
    }

    function handleSubmit() {
        isEditing = false;
        previous = "";
        if (content === "")
            handleRemove();
        else {
            dispatch("text-change", {});
        }
    }

    function handleCancelEdit() {
        if (isEditing) {
            isEditing = false;
            content = previous;
            previous = "";
        }
    }

    function handleDragStart(e) {
        dispatch('drag-start', {"entryId": id});
        isDragged = true;
    }

    function handleDragEnd(e) {
        isDragged = false;
    }

    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            handleCancelEdit();
        }
    }

</script>

<style>

    .entry {
        margin-bottom: 2%;
    }

    .dragged {
        color: red;
    }

    .edit-entry-form {
        display: inline-block;
    }
    
    .oneLiner {
        display: block;
    }

</style>
<span class="entry" class:dragged="{isDragged}" class:oneLiner="{oneLiner}">
    <button on:click={handleRemove} >X</button>
    {#if showDate }
        <Date bind:data={date} on:date-change={handleDateChanged} useDayName={useDayNames}/>
    {/if}
    {#if showTime }
        <Time bind:data={time} on:time-change/>
    {/if}
    {#if isEditing}
        <form on:submit|preventDefault={handleSubmit} class="edit-entry-form">
            <input use:inputAdded bind:value={content} on:blur={handleCancelEdit}
                   on:keydown={handleKeyDown}/>
        </form>
    {:else}
        <span draggable=true  on:click={handleEdit}
              on:dragend={handleDragEnd}
              on:dragstart|stopPropagation={handleDragStart}>{content}</span>
    {/if}
</span>