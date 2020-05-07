<script>
    import {createEventDispatcher} from 'svelte';
    import Entry from './Entry.svelte';
    import Date from './Date.svelte';
    import EntrySeparator from './EntrySeparator.svelte';
    import { SECTIONS, SHOW_DATE } from './utils/constants';
    import { getDaysFromToday } from './utils/time';

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
        sortDatedEntries();
        datedEntries = datedEntries;
    }

    function sortDatedEntries() {
        Object.keys(datedEntries).forEach( date => {
            datedEntries[date].sort( (a,b) => { return a.time - b.time});
        });
    }

    function handleRemoveEntry(event) {
        entries = entries.filter(e => e.id !== event.detail.id);
        dispatch("section-change", {section: SECTIONS.FUTURE});
    }

    function handleDragStart(e) {
        dispatch('drag-start', {section: SECTIONS.FUTURE, entryId: e.detail.entryId})
    }

    function handleGeneralChange(e) {
        dispatch('section-change', {section: SECTIONS.FUTURE});
    }

    function handleTimeChange(e) {
        sortDatedEntries();
        datedEntries = datedEntries;
        dispatch('section-change', {section: SECTIONS.FUTURE});
    }

</script>

<style>
    .entries-future {
        display: grid;
        grid-template-columns: 5% 4% auto auto;
    }
    .date-grid-child-first {
        grid-column: 1;
    }
    .date-grid-child-second {
        grid-column: 2;
    }
    .date-grid-child-rest {
        grid-column: 3;
    }
    .date-grid-child-last {
        grid-column: 4;
    }
    .date-grid-child-all {
        grid-column: 1 / span 4;
    }
</style>

<div class="entries-future"  ondragover="return false">
    {#if Object.keys(datedEntries).length === 0}
        <span class="date-grid-child-all">
            <EntrySeparator date={getDaysFromToday(8)} preSeparatorEntryTime="-1" on:drag-drop fillSpace={true}/>
        </span>
    {/if}
    {#each Object.keys(datedEntries) as date (date) }
        <span class="date-grid-child-first">
            <Date bind:data={date} changeable={false}/>
        </span>
        <span class="date-grid-child-second">
            <EntrySeparator date={date} preSeparatorEntryTime="-1" on:drag-drop fillSpace={true}/>
        </span>
        <span class="date-grid-child-rest">
            {#each datedEntries[date] as entry (entry.id) }
                <Entry on:remove-entry={handleRemoveEntry}
                       on:drag-start={handleDragStart}
                       bind:content={entry.text} bind:date={entry.date}
                       bind:time={entry.time} id={entry.id}
                       on:time-change={handleTimeChange}
                       on:text-change={handleGeneralChange}
                       showDate={SHOW_DATE.ICON}/>
                <EntrySeparator date={date} preSeparatorEntryTime={entry.time} on:drag-drop/>
            {/each}
            <span class="date-grid-child-last">
                <EntrySeparator date={date} preSeparatorEntryTime="9998" on:drag-drop fillSpace={true}/>
            </span>
        </span>
    {/each}
</div>