<script>
    export let offline = true;
    export let lastChangeTimestamp = 0;
    export let dateString = "";

    function printLocalData() {
        console.log(localStorage);
    }

    function printTimestamp() {
        console.log(lastChangeTimestamp);
    }

    $: {
        const d = new Date(parseInt(lastChangeTimestamp));
        let day = d.getDate();
        if (day < 10)
            day = "0" + day;
        let month = d.getMonth() + 1;
        if (month < 10)
            month = "0" + month;
        const year = d.getFullYear();
        let h = d.getHours();
        if (h < 10)
            h = "0" + h;
        let m = d.getMinutes();
        if (m < 10)
            m = "0" + m;
        dateString = day + "/" + month + "/" + Math.floor(year/100) + " " + h + ":" + m;
    }

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

    .last-change {
        right: 0;
        top: 0;
        margin-right: 2%;
        margin-top: 1%;
        position: fixed;
        z-index: 9999;
    }
</style>
<span class="status-indicator" class:status-online={!offline} on:click={printLocalData}/>
<span class="last-change" on:click={printTimestamp}>Last Updated: {dateString}</span>