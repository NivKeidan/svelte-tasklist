<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    export let content = "This entry has no content wtf?!?!";
    export let date = "00000000";
    export let time = "0000";
    export let id = 0;
    let previous = "";
    let isEditing = false;
    let isDragged = false;

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
        isEditing = false;
        content = previous;
        previous = "";
    }

    function inputAdded(el) {
        el.focus();
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

    .date {
        color: blue;
    }

    .time {
        color: orange;
    }
</style>
<div class="entry" class:dragged="{isDragged}">
    <button on:click={handleRemove} >X</button>
    <span class="date">{date}</span>
    <span class="time">{time}</span>
    {#if isEditing}
        <form on:submit|preventDefault={handleSubmit} class="edit-entry-form">
            <input use:inputAdded bind:value={content} on:blur={handleSubmit}
                   on:keydown={handleKeyDown}/>
        </form>
    {:else}
        <span draggable=true  on:click={handleEdit}
              on:dragend={handleDragEnd}
              on:dragstart|stopPropagation={handleDragStart}>{content}</span>
    {/if}
</div>