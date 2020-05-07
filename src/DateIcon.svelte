<script>
    export let opposite = false;
</script>

{#if opposite}
    <span class="time far fa-calendar-alt"></span>
{:else}
    <span class="date far fa-calendar-alt"></span>
{/if}
