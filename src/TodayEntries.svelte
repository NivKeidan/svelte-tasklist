<script>
    import {setContext} from 'svelte';
    import {CONTEXT_CONFIG, SECTIONS} from './constants';
    import Section from './Section.svelte';
    setContext(CONTEXT_CONFIG, {
        showDate: false,
        showTime: true,
    });

    export let entries = [];


</script>

<style>
</style>

<div class="entries-today">
    <Section name={SECTIONS.DAILY} bind:entries on:date-change on:drag-drop on:drag-start on:section-changed/>
</div>