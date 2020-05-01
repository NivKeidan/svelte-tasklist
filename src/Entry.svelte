<script>
    import { createEventDispatcher, getContext } from 'svelte';
    import Date from './Date.svelte';
    import Time from './Time.svelte';
    import {inputAdded} from './utils/forms';
    import {CONTEXT_CONFIG} from './constants';
    const sectionConfig = getContext(CONTEXT_CONFIG);

    const dispatch = createEventDispatcher();
    export let content = "This entry has no content wtf?!?!";
    export let date = "00000000";
    export let time = "0000";
    export let id = 0;
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
            dispatch("entry-changed", {});
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

</style>
<div class="entry" class:dragged="{isDragged}">
    <button on:click={handleRemove} >X</button>
    {#if sectionConfig.showDate }
        <Date bind:data={date} on:date-change={handleDateChanged}/>
    {/if}
    {#if sectionConfig.showTime }
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
</div>