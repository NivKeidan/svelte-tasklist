<script>
    import Section from './Section.svelte';
    import {CONTEXT_CONFIG} from './constants';
    export let entries = [];

    import {setContext} from 'svelte';
    setContext(CONTEXT_CONFIG, {
        showDate: true,
        showTime: true,
    });
</script>

<style>
</style>

<div class="entries-upcoming">
    <Section name="Weekly" bind:entries on:date-change on:drag-drop on:drag-start on:section-changed/>
</div>