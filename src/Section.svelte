<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    import Entry from './Entry.svelte';
    export let entries = [];
    export let name = "";
    let dragCounter = 0;

    function handleRemoveEntry(event) {
        entries = entries.filter(e => e.id !== event.detail.id);
        sectionChanged();
    }

    function sectionChanged() {
        dispatch("section-changed", {});
    }

    function handleDragEnter(e) {
        dragCounter++;
    }

    function handleDragLeave(e) {
        dragCounter--;
    }

    function handleDragDrop(e) {
        dragCounter = 0;
        dispatch('drag-drop', {"targetSectionName": name});
    }

</script>

<style>
    .entries {
        margin-left: 10%;
    }

    .section-header {
        margin-bottom: 2%;
    }

    .dragged-on {
        border: blue solid 1px;
    }
</style>


<div class="entries" class:dragged-on="{dragCounter > 0}" on:dragenter={handleDragEnter}
     on:dragleave={handleDragLeave}
     on:drop|preventDefault={handleDragDrop} ondragover="return false" >
    <div class="section-header"><u><b>{name} Tasks:</b></u></div>
    {#each entries as entry (entry.id)}
        <Entry on:remove-entry={handleRemoveEntry}
               on:drag-start
               on:entry-changed={sectionChanged}
               bind:content={entry.text} bind:date={entry.date}
               bind:time={entry.time} id={entry.id}/>
    {/each}
</div>