<script>
    import {createEventDispatcher} from 'svelte';
    import {getDaysFromToday} from './utils/time';
    import Entry from './Entry.svelte';
    import Date from './Date.svelte';
    import { SECTIONS } from './constants';

    const dispatch = createEventDispatcher();
    const displayDaysNum = 7;
    export let entries = [];
    let dragCounter = 0;
    let datedEntries = getBaseDatedEntriesObject();

    $: {
        datedEntries = getBaseDatedEntriesObject();
        entries.forEach( e => {
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

    function getBaseDatedEntriesObject() {
        let o = {};
        for (let i = 1; i <= displayDaysNum; i++) {
            o[getDaysFromToday(i)] = [];
        }
        return o;
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

    function handleTimeChange(e) {
        sortDatedEntries();
        datedEntries = datedEntries;
        dispatch('section-change', {section: SECTIONS.UPCOMING});
    }

    function handleGeneralChange(e) {
        dispatch('section-change', {section: SECTIONS.UPCOMING});
    }

</script>

<style>
    .upcoming-row {
        margin-bottom: 2%;
    }
</style>

<div class="entries-upcoming"  ondragover="return false">
    {#each Object.entries(datedEntries) as [date, entries], ind }
        <div class="upcoming-row">
            <Date useDayName={true} bind:data={date} changeable={false}/>
            {#each entries as entry (entry.id) }
                <Entry on:remove-entry={handleRemoveEntry}
                       on:drag-start={handleDragStart}
                       bind:content={entry.text} bind:date={entry.date}
                       bind:time={entry.time} id={entry.id}
                       on:date-change={handleDateChange}
                       on:time-change={handleTimeChange}
                       on:text-change={handleGeneralChange}
                       showDate={false}/>
            {/each}
        </div>
    {/each}
</div>