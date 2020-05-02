<script>
    import Section from './Section.svelte';
    import {CONTEXT_CONFIG} from './constants';
    import {SECTIONS, defaultConfig} from './constants';
    export let entries = [];

    import {setContext} from 'svelte';
    let config = Object.assign({}, defaultConfig);
    config.useDayName = true;
    setContext(CONTEXT_CONFIG, config);

</script>

<style>
</style>

<div class="entries-upcoming">
    <Section name={SECTIONS.UPCOMING} bind:entries
             on:date-change on:drag-drop on:drag-start on:section-changed/>
</div>