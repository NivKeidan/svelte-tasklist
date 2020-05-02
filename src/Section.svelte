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
    .section {
        margin-left: 10%;
        font-size: 25px;
    }

    .dragged-on {
        border: blue solid 1px;
    }

    .section-header {
        margin-bottom: 2%;
    }
</style>

<div class="section" class:dragged-on="{dragCounter > 0}"
     on:dragenter={handleDragEnter}
     on:dragleave={handleDragLeave}
     on:drop|preventDefault={handleDragDrop}>
    <div class="section-header"><u><b>{name} Tasks:</b></u></div>
        <slot name="entries"/>
</div>