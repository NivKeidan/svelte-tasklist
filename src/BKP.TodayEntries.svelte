<script>
    import {setContext} from 'svelte';
    import {CONTEXT_CONFIG, SECTIONS, defaultConfig} from './constants';
    import Section from './Section.svelte';
    let config = Object.assign({}, defaultConfig);
    config.showDate = false;
    setContext(CONTEXT_CONFIG, config);

    export let entries = [];


</script>

<style>
</style>

<div class="entries-today">
    <Section name={SECTIONS.DAILY} bind:entries on:date-change on:drag-drop on:drag-start on:section-changed/>
</div>