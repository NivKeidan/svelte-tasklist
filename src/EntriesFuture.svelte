<script>
    import {createEventDispatcher} from 'svelte';
    import Entry from './Entry.svelte';
    import Date from './Date.svelte';
    import EntrySeparator from './EntrySeparator.svelte';
    import { SECTIONS, SHOW_DATE } from './utils/constants';
    import { AutoTimeMin, AutoTimeMax, getNewTime, getDaysFromToday} from './utils/time';

    const dispatch = createEventDispatcher();

    export let entries = [];
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

    function handleGeneralChange() {
        dispatch('section-change', {section: SECTIONS.FUTURE});
    }

    function handleTimeChange() {
        sortDatedEntries();
        datedEntries = datedEntries;
        dispatch('section-change', {section: SECTIONS.FUTURE});
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

    function handleDragDrop(date, previousEntryId) {
        let targetDate = date;
        let prevEntryTime;
        let postEntryTime;

        if (previousEntryId === "empty") {
            targetDate = getDaysFromToday(8);
            prevEntryTime = AutoTimeMin;
            postEntryTime = AutoTimeMax;
        }

        else if (previousEntryId === "first") {
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

    function handleDateChange(e) {
        dispatch('date-change', {section: SECTIONS.FUTURE, entryId: e.detail.entryId});
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
            <EntrySeparator on:drag-drop={() => handleDragDrop("", "empty")} fillSpace={true}/>
        </span>
    {/if}
    {#each Object.keys(datedEntries) as date (date) }
        <span class="date-grid-child-first">
            <Date bind:data={date} changeable={false}/>
        </span>
        <span class="date-grid-child-second">
            <EntrySeparator on:drag-drop={() => handleDragDrop(date, "first")} fillSpace={true}/>
        </span>
        <span class="date-grid-child-rest">
            {#each datedEntries[date] as entry (entry.id) }
                <Entry on:remove-entry={handleRemoveEntry}
                       on:drag-start={handleDragStart}
                       bind:content={entry.text} bind:date={entry.date}
                       bind:time={entry.time} id={entry.id}
                       on:time-change={handleTimeChange}
                       on:date-change={handleDateChange}
                       on:text-change={handleGeneralChange}
                       showDate={SHOW_DATE.ICON}/>
                <EntrySeparator on:drag-drop={() => handleDragDrop(date, entry.id)}/>
            {/each}
            <span class="date-grid-child-last">
                <EntrySeparator on:drag-drop={() => handleDragDrop(date, "last")} fillSpace={true}/>
            </span>
        </span>
    {/each}
</div>