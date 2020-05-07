<script>
    import {createEventDispatcher} from 'svelte';
    import {getDaysFromToday} from './utils/time';
    import Entry from './Entry.svelte';
    import Date from './Date.svelte';
    import EntrySeparator from './EntrySeparator.svelte';
    import { SECTIONS, SHOW_DATE} from './utils/constants';

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
        display: grid;
        grid-template-columns: 8% auto;
    }
    .date-grid-child-first {
        grid-column: 1;
    }
    .date-grid-child-second {
        grid-column: 2;
    }
</style>

<div class="entries-upcoming"  ondragover="return false">
    {#each Object.entries(datedEntries) as [date, entries], ind }
        <div class="upcoming-row">
            <span class="date-grid-child-first">
                <Date bind:data={date} changeable={false} show={SHOW_DATE.DAY}/>
            </span>
            <span class="date-grid-child-second">
                {#each entries as entry (entry.id) }
                    <Entry on:remove-entry={handleRemoveEntry}
                           on:drag-start={handleDragStart}
                           bind:content={entry.text} bind:date={entry.date}
                           bind:time={entry.time} id={entry.id}
                           on:date-change={handleDateChange}
                           on:time-change={handleTimeChange}
                           on:text-change={handleGeneralChange}
                           showDate={SHOW_DATE.NONE}/>
                    <EntrySeparator />
                {/each}
            </span>
        </div>
    {/each}
</div>