<script>
    export let fullLine = false;
    export let fillSpace = false;
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    let dragCounter = 0;

    function handleDragEnter(e) {
        dragCounter++;
    }

    function handleDragLeave(e) {
        dragCounter--;
    }

    function handleDragDrop(e) {
        dragCounter = 0;
        dispatch('drag-drop', {});
    }
</script>

<style>
    .in-line {
        padding-left: 2%;
        padding-right: 2%;
    }
    .fill-space {
        padding-right: 40%;
        padding-left: 50%;
    }
    .dragged-on {
        /*border: green solid 3px;*/
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
      class="{ fullLine ? 'full-line' : fillSpace ? 'fill-space' : 'in-line'}" />