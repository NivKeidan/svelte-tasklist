<script>
    export let opposite = false;
</script>
{#if opposite}
    <span class="time material-icons">event</span>
{:else}
    <span class="date material-icons">event</span>
{/if}
