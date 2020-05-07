<script>
    import {createEventDispatcher} from 'svelte';
    import Entry from './Entry.svelte';
    import EntrySeparator from './EntrySeparator.svelte';
    import {SECTIONS, SHOW_DATE} from './utils/constants';
    import {getDaysFromToday} from './utils/time';

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

</script>

<style>
</style>

<div ondragover="return false">
    <EntrySeparator date={getDaysFromToday(0)} preSeparatorEntryTime="-1" on:drag-drop fullLine={true}/>
    {#each entries as entry (entry.id)}
        <Entry on:remove-entry={handleRemoveEntry}
               on:drag-start={handleDragStart}
               bind:content={entry.text} bind:date={entry.date}
               bind:time={entry.time} id={entry.id}
               on:date-change={handleDateChange}
               on:time-change={handleGeneralChange}
               on:text-change={handleGeneralChange}
               showDate={SHOW_DATE.NONE} oneLiner={true}/>
        <EntrySeparator date={getDaysFromToday(0)} preSeparatorEntryTime={entry.time} on:drag-drop fullLine={true}/>

    {/each}
</div>