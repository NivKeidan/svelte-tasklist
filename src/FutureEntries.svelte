<script>
    import {createEventDispatcher} from 'svelte';
    import Entry from './Entry.svelte';
    import Date from './Date.svelte';
    import EntrySeparator from './EntrySeparator.svelte';
    import { SECTIONS, SHOW_DATE } from './constants';

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
        grid-template-columns: 7% auto;
    }
    .date-grid-child-first {
        grid-column: 1;
    }
    .date-grid-child-second {
        grid-column: 2;
    }
</style>

<div class="entries-future"  ondragover="return false">
    {#each Object.keys(datedEntries) as date (date) }
        <span class="date-grid-child-first">
            <Date bind:data={date} changeable={false}/>
        </span>
        <span class="date-grid-child-second">
            {#each datedEntries[date] as entry (entry.id) }
                <Entry on:remove-entry={handleRemoveEntry}
                       on:drag-start={handleDragStart}
                       bind:content={entry.text} bind:date={entry.date}
                       bind:time={entry.time} id={entry.id}
                       on:time-change={handleTimeChange}
                       on:text-change={handleGeneralChange}
                       showDate={SHOW_DATE.ICON}/>
                <EntrySeparator />
            {/each}
        </span>
    {/each}
</div>