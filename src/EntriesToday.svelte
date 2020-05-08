<script>
    import {createEventDispatcher} from 'svelte';
    import Entry from './Entry.svelte';
    import EntrySeparator from './EntrySeparator.svelte';
    import {SECTIONS, SHOW_DATE} from './utils/constants';
    import {AutoTimeMin, AutoTimeMax, getNewTime, getDaysFromToday} from './utils/time';

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

    function handleDragDrop(previousEntryId) {
        const targetDate = getDaysFromToday(0);
        let prevEntryTime;
        let postEntryTime;

        if (previousEntryId === "first") {
            prevEntryTime = AutoTimeMin;
            const firstEntry = getFirstEntry();
            if (firstEntry === undefined)
                postEntryTime = AutoTimeMax;
            else
                postEntryTime = firstEntry.time;
        }
        else {
            const prevEntry = getEntryById(previousEntryId)
            if (prevEntry === undefined)
                prevEntryTime = AutoTimeMin;
            else
                prevEntryTime = prevEntry.time;
            const postEntry = getEntryAfterEntryById(previousEntryId);
            if (postEntry === undefined)
                postEntryTime = AutoTimeMax;
            else
                postEntryTime = postEntry.time;
        }
        dispatch('drag-drop',  {targetDate, targetTime: getNewTime(prevEntryTime, postEntryTime)});
    }

    function getFirstEntry() {
        return entries[0];
    }

    function getEntryById(id) {
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].id === id)
                return entries[i];
        }
    }

    function getEntryAfterEntryById(id) {
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].id === id)
                return entries[i + 1];
        }
    }

</script>

<style>
</style>

<div ondragover="return false">
    <EntrySeparator on:drag-drop={e => handleDragDrop("first")} fullLine={true}/>
    {#each entries as entry (entry.id)}
        <Entry on:remove-entry={handleRemoveEntry}
               on:drag-start={handleDragStart}
               bind:content={entry.text} bind:date={entry.date}
               bind:time={entry.time} id={entry.id}
               on:date-change={handleDateChange}
               on:time-change={handleGeneralChange}
               on:text-change={handleGeneralChange}
               showDate={SHOW_DATE.NONE} oneLiner={true}/>
        <EntrySeparator on:drag-drop={e => handleDragDrop(entry.id)} fullLine={true}/>
    {/each}
</div>