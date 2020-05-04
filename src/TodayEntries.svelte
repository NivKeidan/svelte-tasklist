<script>
    import {createEventDispatcher} from 'svelte';
    import {getDaysFromToday} from './utils/time';
    import Entry from './Entry.svelte';
    import {SECTIONS} from './constants';

    const dispatch = createEventDispatcher();

    export let entries = [];
    let dragCounter = 0;

    function handleRemoveEntry(event) {
        entries = entries.filter(e => e.id !== event.detail.id);
        dispatch("section-change", {section: SECTIONS.DAILY});
    }

    function handleDragStart(e) {
        dispatch('drag-start', {section: SECTIONS.DAILY, entryId: e.detail.entryId})
    }

    function handleDateChange(e) {
        dispatch('date-change', {section: SECTIONS.DAILY, entryId: e.detail.entryId});
    }

    function handleGeneralChange(e) {
        dispatch('section-change', {section: SECTIONS.DAILY});
    }

    function shouldShowDate(d) {
        return d !== getDaysFromToday(0);
    }

</script>

<style>
</style>

<div class="entries-today"  ondragover="return false" >
    {#each entries as entry (entry.id)}
        <Entry on:remove-entry={handleRemoveEntry}
               on:drag-start={handleDragStart}
               bind:content={entry.text} bind:date={entry.date}
               bind:time={entry.time} id={entry.id}
               on:date-change={handleDateChange}
               on:time-change={handleGeneralChange}
               on:text-change={handleGeneralChange}
               showDate={shouldShowDate(entry.date)} oneLiner={true}/>
    {/each}
</div>