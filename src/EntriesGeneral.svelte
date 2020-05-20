<script>
    import {createEventDispatcher} from 'svelte';
    import Entry from './Entry.svelte';
    import {SECTIONS, SHOW_DATE, NO_DATE} from './utils/constants';

    const dispatch = createEventDispatcher();
    export let entries = [];

    function handleRemoveEntry(event) {
        entries = entries.filter(e => e.id !== event.detail.id);
        dispatch("section-change", {section: SECTIONS.GENERAL});
    }

    function handleGeneralChange() {
        dispatch('section-change', {section: SECTIONS.GENERAL});
    }

</script>

<style>
    .general-entry-separator {
        font-size: 20px;
        margin-bottom: 2%;
    }
</style>

<div ondragover="return false">
    {#each entries as entry (entry.id)}
        <div class="general-entry-separator">
            <Entry on:remove-entry={handleRemoveEntry}
                   on:text-change={handleGeneralChange}
                   bind:content={entry.text} date={NO_DATE}
                   id={entry.id} showDate={SHOW_DATE.NONE}
                   showTime={false} isDraggable={false}/>
        </div>
    {/each}
</div>