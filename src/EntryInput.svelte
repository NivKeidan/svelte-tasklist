<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    let text = "";

    function handleSubmit() {
        if (text !== "") {
            dispatch('new-entry', text);
            text = "";
        }
    }
</script>

<style>
    .input {
        text-align: center;
    }
    .entry-input {
        width: 50%;
        margin-bottom: 4%;
        margin-top: 1%;
    }
</style>

<div class="input">
    <form on:submit|preventDefault={handleSubmit}>
        <input bind:value={text} class="entry-input"/>
        <button>Add</button>
    </form>
</div>