<script>
    export let opposite = false;
</script>

{#if opposite}
    <span class="date far fa-clock"></span>
{:else}
    <span class="time far fa-clock"></span>
{/if}