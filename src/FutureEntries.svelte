<script>
    import Section from './Section.svelte';
    import {setContext} from 'svelte';
    import {CONTEXT_CONFIG, SECTIONS, defaultConfig} from './constants';
    export let entries = [];

    let config = Object.assign({}, defaultConfig);
    config.showTime = false;
    setContext(CONTEXT_CONFIG, config);
</script>

<style>
</style>

<div class="entries-future">
    <Section name={SECTIONS.FUTURE} bind:entries on:date-change on:drag-drop on:drag-start on:section-changed/>
</div>