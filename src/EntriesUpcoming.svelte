<script>
    import {createEventDispatcher} from 'svelte';
    import {getDaysFromToday} from './utils/time';
    import {timeCompareFn, AutoTimeMin, AutoTimeMax, getNewTime} from './utils/time';
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

    function handleTimeChange(e) {
        sortDatedEntries();
        datedEntries = datedEntries;
        dispatch('section-change', {section: SECTIONS.UPCOMING});
    }

    function handleGeneralChange(e) {
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
        grid-template-columns: 6% 4% auto auto;
    }
    .no-entries {
        grid-template-columns: 6% auto auto;
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
</style>

<div class="entries-upcoming">
    {#each Object.entries(datedEntries) as [date, entries], ind }
        <div class="upcoming-row {entries.length === 0 ? 'no-entries' : ''}">
            <span class="date-grid-child-first">
                <Date bind:data={date} changeable={false} show={SHOW_DATE.DAY}/>
            </span>
            <span class="date-grid-child-second">
                <EntrySeparator on:drag-drop={e => handleDragDrop(date, "first")} fillSpace={true}/>
            </span>
            <span class="date-grid-child-rest">
                {#each entries as entry (entry.id) }
                    <Entry on:remove-entry={handleRemoveEntry}
                           on:drag-start={handleDragStart}
                           bind:content={entry.text} bind:date={entry.date}
                           bind:time={entry.time} id={entry.id}
                           on:date-change={handleDateChange}
                           on:time-change={handleTimeChange}
                           on:text-change={handleGeneralChange}
                           showDate={SHOW_DATE.NONE}/>
                    <EntrySeparator on:drag-drop={e => handleDragDrop(date, entry.id)}/>
                {/each}
                <span class="date-grid-child-last">
                    <EntrySeparator on:drag-drop={e => handleDragDrop(date, "last")} fillSpace={true}/>
                </span>
            </span>
        </div>
    {/each}
</div>