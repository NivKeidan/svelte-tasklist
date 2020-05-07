<script>
    import { createEventDispatcher } from 'svelte';
    import './Section.css';

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



<div class="entries-section" class:dragged-on="{dragCounter > 0}"
     on:dragenter={handleDragEnter}
     on:dragleave={handleDragLeave}
     on:drop|preventDefault={handleDragDrop}>
        <slot/>
</div>