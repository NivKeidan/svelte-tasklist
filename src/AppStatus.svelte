<script>
    export let offline = true;
</script>

<style>
    .status-indicator {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 9999;
        height: 25px;
        width: 25px;
        background-color: RED;
        border-radius: 50%;
        margin-left: 1%;
        margin-top: 1%;
    }

    .status-online {
        background-color: GREEN;
    }
</style>
<span class="status-indicator" class:status-online={!offline}/>