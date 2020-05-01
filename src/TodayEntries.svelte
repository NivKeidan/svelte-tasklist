<script>
    import Section from './Section.svelte';
    export let entries = [];
</script>

<style>
</style>

<div class="entries-today">
    <Section name="Daily" bind:entries on:date-change on:drag-drop on:drag-start on:section-changed/>
</div>