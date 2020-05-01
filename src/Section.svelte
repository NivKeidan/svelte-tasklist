<script>
    import { createEventDispatcher, onMount } from 'svelte';
    const dispatch = createEventDispatcher();
    import Entry from './Entry.svelte';
    export let entries = [];
    export let name = "";
    let dragCounter = 0;

    onMount( () => {
        reSort();
    });

    function reSort() {
        console.log("resorting " + name);
        entries.sort((a,b) => {
            if (a.date === b.date)
                return a.time - b.time;
            else
                return a.date - b.date;
        });
        entries = entries;
    }

    function handleRemoveEntry(event) {
        entries = entries.filter(e => e.id !== event.detail.id);
        sectionChanged();
    }

    function sectionChanged() {
        dispatch("section-changed", {});
        reSort();
    }

    function handleDateChange(e) {
        dispatch('date-change', {entryId: e.detail.entryId});
        reSort();
    }

    function handleDragEnter(e) {
        dragCounter++;
    }

    function handleDragLeave(e) {
        dragCounter--;
    }

    function handleDragDrop(e) {
        dragCounter = 0;
        dispatch('drag-drop', {});
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
               bind:time={entry.time} id={entry.id} on:date-change={handleDateChange}
               on:time-change={reSort} />
    {/each}
</div>