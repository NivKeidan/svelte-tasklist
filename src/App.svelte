<script>
	import {onMount} from 'svelte';
	import {getDaysFromToday, getLastUpcomingDateString} from './utils/time';
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
		then(data => populateSections(data)).
		catch( e => console.log("failed getting data", e));
	});

	function populateSections(data) {
		data.forEach(e => insertNewEntry(e, false));
	}

	function saveEntries() {
		let allEntries = getAllEntries();
		fetch("http://localhost:3333", {
			method: "POST",
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(allEntries),
		}).
		then(data => console.log("saved success")).
		catch(err => console.log("save failed", err));
	}

	// ---------- Utils -------------

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

	function sortSection(section) {
		let sectionObject = getEntriesObject(section);
		sectionObject.sort((a,b) => {
			if (a.date === b.date)
				return a.time - b.time;
			else
				return a.date - b.date;
		});
	}

	function insertEntry(section, entry, saveChanges=true) {
		let sectionObject = getEntriesObject(section);
		sectionObject.push(entry);
		sortSection(section);
		updateSection(section).then(() => {
			if (saveChanges)
				saveEntries();
		});
	}

	function insertNewEntry(entry, saveChanges=true) {
		let section = SECTIONS.FUTURE;
		if (entry.date <= getTodayDateString())
			section = SECTIONS.DAILY;
		if (entry.date <= getLastUpcomingDateString())
			section = SECTIONS.UPCOMING;
		insertEntry(section, entry, saveChanges);
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

	// ---------- Event Handlers -------------

	function handleSectionChanged(e) {
		// Called when entry text or time has changed
		sortSection(e.detail.section);
		saveEntries();
	}

	function handleNewEntry(event) {
		let newEntry = {text: event.detail.text, id: generateNewId(),
			date: event.detail.date, time: event.detail.time};
		insertNewEntry(newEntry);
	}

	function handleDateChange(e) {
		let entryId = e.detail.entryId;
		let originSection = e.detail.section;
		let entry = getEntryById(originSection, entryId);
		removeEntryById(originSection, entryId, false);
		insertNewEntry(entry);
	}

	function handleDragDrop(e) {
		const targetSection = e.detail.section;
		if (dragOrigin !== targetSection) {
			let entry = getEntryById(dragOrigin, draggedEntryId);
			removeEntryById(dragOrigin, draggedEntryId, false);
			switch (targetSection) {
				case SECTIONS.DAILY:
					entry.date = getDaysFromToday(0);
					break;
				case SECTIONS.UPCOMING:
					entry.date = getDaysFromToday(5);
					break;
				case SECTIONS.FUTURE:
					entry.date = getDaysFromToday(30);
					break;
			}
			insertNewEntry(entry);
		}
	}

	function handleDragStart(e) {
		dragOrigin = e.detail.section;
		draggedEntryId = e.detail.entryId;
	}

</script>

<style>
	:global(:root){
		--date-color: #4545ff;
		--time-color: orange;
	}
</style>

<div class="app">
	<Header/>
	<EntryInput on:new-entry={handleNewEntry}/>
	<TodayEntries bind:entries={dailyEntries}
				  on:section-changed={handleSectionChanged} on:drag-drop={handleDragDrop}
				  on:drag-start={handleDragStart} on:date-change={handleDateChange}/>
	<UpcomingEntries bind:entries={weeklyEntries} on:section-changed={handleSectionChanged}
					 on:drag-drop={handleDragDrop} on:drag-start={handleDragStart}
					 on:date-change={handleDateChange}/>
	<FutureEntries bind:entries={futureEntries} on:section-changed={handleSectionChanged}
				   on:drag-drop={handleDragDrop} on:drag-start={handleDragStart}
				   on:date-change={handleDateChange}/>
</div>