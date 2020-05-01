<script>
    import Section from './Section.svelte';
    import {setContext} from 'svelte';
    import {CONTEXT_CONFIG, SECTIONS} from './constants';
    export let entries = [];


    setContext(CONTEXT_CONFIG, {
        showDate: true,
        showTime: false,
    });
</script>

<style>
</style>

<div class="entries-future">
    <Section name={SECTIONS.FUTURE} bind:entries on:date-change on:drag-drop on:drag-start on:section-changed/>
</div>