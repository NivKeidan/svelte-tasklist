<script>
    import { createEventDispatcher } from 'svelte';
    import Date from './Date.svelte';
    import Time from './Time.svelte';
    import Fa from 'svelte-fa';
    import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
    import {inputAdded} from './utils/forms';
    import {AutoTimeDefault} from './utils/time';
    import {getDaysFromToday} from './utils/date';
    import {SHOW_DATE} from './utils/constants';
    import './Entry.css';
    import { fly } from 'svelte/transition';

    const dispatch = createEventDispatcher();
    export let content = "This entry has no content wtf?!?!";
    export let date = getDaysFromToday(0);
    export let time = AutoTimeDefault;
    export let id = 0;
    export let showDate = SHOW_DATE.FULL;
    export let oneLiner = false;
    export let isDraggable = true;
    export let showTime = true;
    let previous = "";
    let isEditing = false;
    let isDragged = false;

    function handleDateChanged() {
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

    function handleDragStart() {
        dispatch('drag-start', {"entryId": id});
        isDragged = true;
    }

    function handleDragEnd() {
        isDragged = false;
    }

    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            handleCancelEdit();
        }
    }

</script>
<span in:fly="{{x: -100, y: 0, duration: 750}}" out:fly|local="{{x: 100, y: 0, duration: 750}}"
      class:dragged="{isDragged}" class:oneLiner="{oneLiner}">
    <Date bind:data={date} show={showDate} on:date-change={handleDateChanged}/>
    {#if showTime}
        <Time bind:data={time} on:time-change/>
    {/if}
    <span class="entry-text">
        {#if isEditing}
            <form on:submit|preventDefault={handleSubmit} class="edit-entry-form">
                <input size={content.length*0.6} use:inputAdded bind:value={content} on:blur={handleCancelEdit}
                       on:keydown={handleKeyDown} class="edit-entry-input"/>
            </form>
        {:else}
            <span draggable={isDraggable}  on:click={handleEdit}
                  on:dragend={handleDragEnd}
                  on:dragstart|stopPropagation={handleDragStart}>{content}</span>
        {/if}
    </span>
   <span on:click={handleRemove}>
       <Fa class="icon-remove-entry" icon={faTrashAlt} />
   </span>
</span>