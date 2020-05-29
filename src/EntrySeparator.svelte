<script>
    export let fullLine = false;
    export let fillSpace = false;
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    let dragCounter = 0;

    function handleDragEnter() {
        dragCounter++;
    }

    function handleDragLeave() {
        dragCounter--;
    }

    function handleDragDrop() {
        dragCounter = 0;
        dispatch('drag-drop', {});
    }
</script>

<style>
    .in-line {
        width: 4%;
    }
    .fill-space {
        flex-grow: 100;
    }
    .dragged-on {
        background-color: lightblue;
    }
    .full-line {
        padding-top: 0.5%;
        padding-bottom: 0.5%;
        display: block;
        width: 15%;
    }
</style>

<span on:dragenter={handleDragEnter}
      on:dragleave={handleDragLeave}
      on:dragover|preventDefault
      on:drop|preventDefault={handleDragDrop}
      class:dragged-on="{dragCounter > 0}"
     class="{ fullLine ? 'full-line' : fillSpace ? 'fill-space' : 'in-line'}"/>