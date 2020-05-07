<script>
    import Fa from 'svelte-fa'
    import { faCalendar } from '@fortawesome/free-regular-svg-icons'
    export let opposite = false;
</script>

{#if opposite}
    <Fa class="time" icon={faCalendar}/>
{:else}
    <Fa class="date" icon={faCalendar}/>
{/if}
