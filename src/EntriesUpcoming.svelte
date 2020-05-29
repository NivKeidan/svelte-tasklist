<script>
    import {createEventDispatcher} from 'svelte';
    import {getDaysFromToday} from './utils/date';
    import {timeCompareFn, AutoTimeMin, AutoTimeMax, getNewTime} from './utils/time';
    import Entry from './Entry.svelte';
    import Date from './Date.svelte';
    import EntrySeparator from './EntrySeparator.svelte';
    import { SECTIONS, SHOW_DATE} from './utils/constants';

    const dispatch = createEventDispatcher();
    const displayDaysNum = 7;
    export let entries = [];
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
            datedEntries[date].sort( (a,b) => { return timeCompareFn(a.time, b.time)});
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

    function handleTimeChange() {
        sortDatedEntries();
        datedEntries = datedEntries;
        dispatch('section-change', {section: SECTIONS.UPCOMING});
    }

    function handleGeneralChange() {
        dispatch('section-change', {section: SECTIONS.UPCOMING});
    }

    function handleDragDrop(date, previousEntryId) {
        const targetDate = date;
        let prevEntryTime;
        let postEntryTime;

        if (previousEntryId === "first") {
            prevEntryTime = AutoTimeMin;
            const firstEntry = getFirstEntry(date);
            if (firstEntry === undefined)
                postEntryTime = AutoTimeMax;
            else
                postEntryTime = firstEntry.time;
        }

        else if (previousEntryId === "last") {
            postEntryTime = AutoTimeMax;
            const lastEntry = getLastEntry(date);
            if (lastEntry === undefined)
                prevEntryTime = AutoTimeMin;
            else
                prevEntryTime = lastEntry.time;
        }
        else {
            prevEntryTime = getEntryById(previousEntryId).time;
            const postEntry = getEntryAfterEntryById(date, previousEntryId);
            if (postEntry === undefined)
                postEntryTime = AutoTimeMax;
            else
                postEntryTime = postEntry.time;
        }
        dispatch('drag-drop',  {targetDate, targetTime: getNewTime(prevEntryTime, postEntryTime)});
    }

    function getFirstEntry(date) {
        return datedEntries[date][0];
    }

    function getLastEntry(date) {
        const len = datedEntries[date].length;
        return datedEntries[date][len-1];
    }

    function getEntryById(id) {
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].id === id)
                return entries[i];
        }
    }

    function getEntryAfterEntryById(date, id) {
        for (let i = 0; i < datedEntries[date].length; i++) {
            if (datedEntries[date][i].id === id)
                return datedEntries[date][i+1];
        }
    }

</script>

<style>
    .upcoming-row {
        display: grid;
        grid-template-columns: 6% 94%;
        margin-bottom: 2%;
    }
    .date-grid-child-first {
        grid-column: 1;
    }
    .date-grid-child-rest {
        grid-column: 2;
        display: flex;
        flex-flow: row wrap;
    }
</style>

<div class="entries-upcoming">
    {#each Object.entries(datedEntries) as [date, entries], ind }
        <div class="upcoming-row">
            <span class="date-grid-child-first">
                <Date bind:data={date} changeable={false} show={SHOW_DATE.DAY}/>
            </span>
            <span class="date-grid-child-rest">
                {#each entries as entry, entryIndex (entry.id) }
                    {#if entryIndex === 0}
                        <EntrySeparator on:drag-drop={() => handleDragDrop(date, "first")}/>
                    {/if}
                    <Entry on:remove-entry={handleRemoveEntry}
                           on:drag-start={handleDragStart}
                           bind:content={entry.text} bind:date={entry.date}
                           bind:time={entry.time} id={entry.id}
                           on:date-change={handleDateChange}
                           on:time-change={handleTimeChange}
                           on:text-change={handleGeneralChange}
                           showDate={SHOW_DATE.NONE}/>
                    {#if entryIndex !== entries.length-1}
                        <EntrySeparator on:drag-drop={() => handleDragDrop(date, entry.id)}/>
                    {/if}
                {/each}
                <EntrySeparator on:drag-drop={() => handleDragDrop(date, "last")} fillSpace={true}/>
            </span>
        </div>
    {/each}
</div>