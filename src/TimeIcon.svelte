


<script>
    export let opposite = false;
</script>
{#if opposite}
    <span class="date material-icons">alarm</span>
{:else}
    <span class="time material-icons">alarm</span>
{/if}