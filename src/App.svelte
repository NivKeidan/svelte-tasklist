<script>
	import {onMount} from 'svelte';
	import TodayEntries from './TodayEntries.svelte';
	import UpcomingEntries from './UpcomingEntries.svelte';
	import EntryInput from './EntryInput.svelte';
	import Header from './Header.svelte';
	import {getDefaultDate, getDefaultTime, isWeekly} from './utils_time';

	let dailyEntries = [];
	let weeklyEntries = [];
	let draggedEntry = {};
	let dragSuccessCallback = null;

	onMount( async () => {
		await fetch("http://localhost:3333").
		then(r => r.json()).
		then( data => {
			data.forEach(e => {
				if (isWeekly(e.date))
					weeklyEntries = [...weeklyEntries, e];
				else
					dailyEntries = [...dailyEntries, e];  // Daily is default
				});
			}).
		catch( e => console.log("failed getting data", e));
	});

	function saveEntries() {
		let allEntries = getAllEntries();
		fetch("http://localhost:3333", {
			method: "POST",
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(allEntries),
		}).
		then(data => console.log("save success", data)).
		catch(err => console.log("save failed", err));
	}

	function getAllEntries() {
		let all = [];
		dailyEntries.forEach( e => all.push(e));
		weeklyEntries.forEach( e => all.push(e));
		return all;
	}

	function handleNewEntry(event) {
		let newEntry = {text: event.detail, id: generateNewId(), date: getDefaultDate(), time: getDefaultTime()};

		if (isEntryUpcoming(event.detail)) {
			weeklyEntries = [...weeklyEntries, newEntry];
		} else {  // default is Today Section
			dailyEntries = [...dailyEntries, newEntry];
		}
		saveEntries();
	}

	function isEntryToday(newEntryText) {
		return newEntryText.toLowerCase().includes('today');
	}

	function isEntryUpcoming(newEntryText) {
		return newEntryText.toLowerCase().includes('upcoming');
	}

	function generateNewId() {
		let highest = 0;
		dailyEntries.forEach( e => {
			if (e.id > highest)
				highest = e.id;
		});

		weeklyEntries.forEach( e => {
			if (e.id > highest)
				highest = e.id;
		});
		return highest+1;
	}

	function handleDailyDragDrop(e) {
		dailyEntries = [...dailyEntries, draggedEntry];
		dragSuccessCallback().then( () => saveEntries() );
	}

	function handleWeeklyDragDrop(e) {
		weeklyEntries = [...weeklyEntries, draggedEntry];
		dragSuccessCallback().then( () => saveEntries() );
	}

	function findEntryIndexById(section, entryId) {
		for(let i = 0; i < section.length; i += 1) {
			if(section[i].id === entryId) {
				return i;
			}
		}
		return -1;
	}

	function handleDailyDragStart(e) {
		let ind = findEntryIndexById(dailyEntries, e.detail.entryId);
		draggedEntry = dailyEntries[ind];
		dragSuccessCallback = async function () {
			dailyEntries = dailyEntries.filter(e => e !== draggedEntry);
			draggedEntry = null;
		};
	}

	function handleWeeklyDragStart(e) {
		let ind = findEntryIndexById(weeklyEntries, e.detail.entryId);
		draggedEntry = weeklyEntries[ind];
		dragSuccessCallback = async function () {
			dailyEntries = weeklyEntries.filter(e => e !== draggedEntry);
			draggedEntry = null;
		};
	}

</script>

<style>
</style>

<div class="app">
	<Header/>
	<EntryInput on:new-entry={handleNewEntry}/>
	<TodayEntries bind:entries={dailyEntries} on:section-changed={saveEntries} on:drag-drop={handleDailyDragDrop} on:drag-start={handleDailyDragStart}/>
	<UpcomingEntries bind:entries={weeklyEntries} on:section-changed={saveEntries} on:drag-drop={handleWeeklyDragDrop} on:drag-start={handleWeeklyDragStart}/>
</div>