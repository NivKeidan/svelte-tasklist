<script>
    import {errors} from './stores';
    import { fade } from 'svelte/transition';
</script>

<style>

    .error-list {
        position: fixed;
        color: red;
        font-size: 30px;
    }

</style>

<div class="error-list">
    {#each $errors as err, i }
        <div out:fade="{{ duration: 2000 }}">{err}</div>
    {/each}
</div>