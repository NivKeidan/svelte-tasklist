<script>
    import {createEventDispatcher} from 'svelte';
    import Entry from './Entry.svelte';
    import Date from './Date.svelte';
    import { SECTIONS } from './constants';

    const dispatch = createEventDispatcher();
    export let entries = [];
    let dragCounter = 0;
    let datedEntries = {};

    $: {
        datedEntries = {};
        entries.forEach( e => {
            if (!datedEntries[e.date])
                datedEntries[e.date] = [];
            datedEntries[e.date] = [...datedEntries[e.date], e];
        });
        // TODO sort
    }

    function handleRemoveEntry(event) {
        entries = entries.filter(e => e.id !== event.detail.id);
        dispatch("section-change", {section: SECTIONS.UPCOMING});
    }

    function handleDragStart(e) {
        dispatch('drag-start', {section: SECTIONS.UPCOMING, entryId: e.detail.entryId})
    }

    function handleDateChange(e) {
        dispatch('date-change', {section: SECTIONS.UPCOMING, entryId: e.detail.entryId});
    }

    function handleGeneralChange(e) {
        dispatch('section-change', {section: SECTIONS.UPCOMING});
    }

</script>

<style>
</style>

<div class="entries-upcoming"  ondragover="return false">
    {#each Object.entries(datedEntries) as [date, entries], ind }
        <div>
            <Date useDayName={true} bind:data={date}/>
            {#each entries as entry (entry.id) }
                <Entry on:remove-entry={handleRemoveEntry}
                       on:drag-start={handleDragStart}
                       bind:content={entry.text} bind:date={entry.date}
                       bind:time={entry.time} id={entry.id}
                       on:date-change={handleDateChange}
                       on:time-change={handleGeneralChange}
                       on:text-change={handleGeneralChange}
                       showDate={false}/>
            {/each}
        </div>
    {/each}
</div>