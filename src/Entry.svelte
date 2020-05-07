<script>
    import { createEventDispatcher } from 'svelte';
    import Date from './Date.svelte';
    import Time from './Time.svelte';
    import Fa from 'svelte-fa';
    import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
    import {inputAdded} from './utils/forms';
    import {getDaysFromToday} from './utils/time';
    import {NullTime, SHOW_DATE} from './utils/constants';
    import './Entry.css';

    const dispatch = createEventDispatcher();
    export let content = "This entry has no content wtf?!?!";
    export let date = getDaysFromToday(0);
    export let time = NullTime;
    export let id = 0;
    export let showDate = SHOW_DATE.FULL;
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

<span class="entry" class:dragged="{isDragged}" class:oneLiner="{oneLiner}">
    <Date bind:data={date} show={showDate} on:date-change={handleDateChanged}/>
    <Time bind:data={time} on:time-change/>
    <span class="entry-text">
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
   <span on:click={handleRemove}>
       <Fa class="icon-remove-entry" icon={faTrashAlt} />
   </span>
</span>