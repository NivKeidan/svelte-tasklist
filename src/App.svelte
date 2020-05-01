<script>
	import {onMount} from 'svelte';
	import {getDaysFromToday, getSection} from './utils/time';
	import { SECTIONS } from './constants';

	import TodayEntries from './TodayEntries.svelte';
	import UpcomingEntries from './UpcomingEntries.svelte';
	import FutureEntries from './FutureEntries.svelte';
	import EntryInput from './EntryInput.svelte';
	import Header from './Header.svelte';


	let dailyEntries = [];
	let weeklyEntries = [];
	let futureEntries = [];

	let dragOrigin = "";
	let draggedEntryId = 0;

	onMount( async () => {
		await fetch("http://localhost:3333").then(r => r.json()).
		then(data => sortToSections(data)).
		catch( e => console.log("failed getting data", e));
	});

	function sortToSections(data) {
		data.forEach(e => insertNewEntry(e, false));
	}

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

	// ---------- Utils, sort of -------------

	function getEntriesObject(section) {
		switch (section) {
			case SECTIONS.DAILY:
				return dailyEntries;
			case SECTIONS.UPCOMING:
				return weeklyEntries;
			case SECTIONS.FUTURE:
				return futureEntries;
			default:
				console.log("could not get entries object from input: ", section);
				return null;
		}
	}

	async function updateSection(section) {
		// Weird Svelte hacks to make the dom reflect changes
		switch (section) {
			case SECTIONS.DAILY:
				dailyEntries = dailyEntries;
				break;
			case SECTIONS.UPCOMING:
				weeklyEntries = weeklyEntries;
				break;
			case SECTIONS.FUTURE:
				futureEntries = futureEntries;
				break;
			default:
				console.log("could not get entries object from input: ", section);
				return null;
		}
	}

	function insertEntry(section, entry, saveChanges=true) {
		let sectionObject = getEntriesObject(section);
		sectionObject.push(entry);
		sectionObject.sort((a,b) => {
			if (a.date === b.date)
				return a.time - b.time;
			else
				return a.date - b.date;
		});
		updateSection(section).then(() => {
			if (saveChanges)
				saveEntries();
		});
	}

	function insertNewEntry(entry, saveChanges=true) {
		insertEntry(getSection(entry.date), entry, saveChanges);
	}

	function getAllEntries() {
		let all = [];
		Object.values(SECTIONS).forEach( s => {
			getEntriesObject(s).forEach( e => {
				all.push(e);
			})
		});
		return all;
	}

	function generateNewId() {
		let highest = 0;
		const allEntries = getAllEntries();

		allEntries.forEach( e => {
			if (e.id > highest)
				highest = e.id;
		});
		return highest+1;
	}

	function getIndexById(arr, id) {
		for(let i = 0; i < arr.length; i += 1) {
			if(arr[i].id === id) {
				return i;
			}
		}
		return -1;
	}

	function removeEntryById(section, id, shouldSave=true) {
		let sectionObject = getEntriesObject(section);
		let ind = getIndexById(sectionObject, id);
		sectionObject.splice(ind, 1);
		updateSection(section).then( () => {
			if (shouldSave)
				saveEntries();
		});
	}

	function getEntryById(section, id) {
		let sectionObject = getEntriesObject(section);
		let ind = getIndexById(sectionObject, id);
		return sectionObject[ind];
	}

	// ---------- New Entry -------------

	function handleNewEntry(event) {
		let newEntry = {text: event.detail.text, id: generateNewId(),
			date: event.detail.date, time: event.detail.time};
		insertNewEntry(newEntry);
	}

	// ---------- Date Change -------------

	function handleDateChange(entryId, originSection) {
		let entry = getEntryById(originSection, entryId);
		removeEntryById(originSection, entryId, false);
		insertNewEntry(entry);
	}

	function handleDateChangeInToday(e) {
		handleDateChange(e.detail.entryId, SECTIONS.DAILY);
	}

	function handleDateChangeInUpcoming(e) {
		handleDateChange(e.detail.entryId, SECTIONS.UPCOMING);
	}

	function handleDateChangeInFuture(e) {
		handleDateChange(e.detail.entryId, SECTIONS.FUTURE);
	}

	// ---------- Drag and Drop -------------

	function finalizeDrag(modifyEntryFn=null) {
		let entry = getEntryById(dragOrigin, draggedEntryId);
		removeEntryById(dragOrigin, draggedEntryId, false);
		if (modifyEntryFn !== null) {
			modifyEntryFn(entry);
		}
		insertNewEntry(entry);
	}

	function handleDailyDragDrop(e) {
		if (dragOrigin !== SECTIONS.DAILY) {
			finalizeDrag( (entry) => entry.date = getDaysFromToday(0));
		}
	}

	function handleWeeklyDragDrop(e) {
		if (dragOrigin !== SECTIONS.UPCOMING) {
			finalizeDrag((entry) => entry.date = getDaysFromToday(5));
		}
	}

	function handleFutureDragDrop(e) {
		if (dragOrigin !== SECTIONS.FUTURE) {
			finalizeDrag((entry) => entry.date = getDaysFromToday(30));
		}
	}

	function handleDragStart(e) {
		draggedEntryId = e.detail.entryId;
	}

	function handleDailyDragStart(e) {
		dragOrigin = SECTIONS.DAILY;
		handleDragStart(e);
	}

	function handleWeeklyDragStart(e) {
		dragOrigin = SECTIONS.UPCOMING;
		handleDragStart(e);
	}

	function handleFutureDragStart(e) {
		dragOrigin = SECTIONS.FUTURE;
		handleDragStart(e);
	}

</script>

<style>
	:global(:root){
		--date-color: blue;
		--time-color: orange;
	}
</style>

<div class="app">
	<Header/>
	<EntryInput on:new-entry={handleNewEntry}/>
	<TodayEntries bind:entries={dailyEntries} on:section-changed={saveEntries}
				  on:drag-drop={handleDailyDragDrop} on:drag-start={handleDailyDragStart}
				  on:date-change={handleDateChangeInToday}/>
	<UpcomingEntries bind:entries={weeklyEntries} on:section-changed={saveEntries}
					 on:drag-drop={handleWeeklyDragDrop} on:drag-start={handleWeeklyDragStart}
					 on:date-change={handleDateChangeInUpcoming}/>
	<FutureEntries bind:entries={futureEntries} on:section-changed={saveEntries}
				   on:drag-drop={handleFutureDragDrop} on:drag-start={handleFutureDragStart}
				   on:date-change={handleDateChangeInFuture}/>
</div>