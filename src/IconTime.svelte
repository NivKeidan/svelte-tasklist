<script>
    import Fa from 'svelte-fa'
    import { faClock } from '@fortawesome/free-regular-svg-icons'
    export let opposite = false;
</script>

{#if opposite}
    <Fa class="date" icon={faClock}/>
{:else}
    <Fa class="time" icon={faClock}/>
{/if}