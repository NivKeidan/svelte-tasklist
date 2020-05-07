<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    export let name = "";

    let dragCounter = 0;

    function handleDragEnter(e) {
        dragCounter++;
    }

    function handleDragLeave(e) {
        dragCounter--;
    }

    function handleDragDrop(e) {
        dragCounter = 0;
        dispatch('drag-drop', {section: name});
    }

</script>

<style>
    .entries-section {
        font-size: 20px;
    }

    .dragged-on {
        border: blue solid 1px;
    }
</style>


<div class="entries-section" class:dragged-on="{dragCounter > 0}"
     on:dragenter={handleDragEnter}
     on:dragleave={handleDragLeave}
     on:drop|preventDefault={handleDragDrop}>
        <slot/>
</div>