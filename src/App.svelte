<script>
	import {onMount} from 'svelte';
	import { userMessages } from './stores.js';
	import {getDaysFromToday} from './utils/date';
	import {timeCompareFn, AutoTimeDefault, getNewTime} from './utils/time';
	import { SECTIONS, NO_DATE } from './utils/constants';
	import { getCookie, setCookie } from './utils/cookies';

	import TodayEntries from './EntriesToday.svelte';
	import UpcomingEntries from './EntriesUpcoming.svelte';
	import FutureEntries from './EntriesFuture.svelte';
	import GeneralEntries from './EntriesGeneral.svelte';
	import EntryInput from './EntryInput.svelte';
	import Header from './Header.svelte';
	import SectionSeaprator from './SectionSeaprator.svelte';
	import Toast from './Toast.svelte';
	import AppStatus from './AppStatus.svelte';

	import './App.css';

	const delayBetweenServerReachAttempts = 1000;
	let dailyEntries = [];
	let weeklyEntries = [];
	let futureEntries = [];
	let generalEntries = [];
	let currentToday = new Date();

	let dragOrigin = "";
	let draggedEntryId = 0;
	let highestId = 0;
	let offline = true;
	let afterInitialLoad = false;
	let headers = null;

	onMount( async () => {
		loadDataFromServer();
	});

	$: if (offline && afterInitialLoad) {
		checkServerIsReachable();
	}

	function loadCookie() {
		const c = getCookie();
		if (c !== undefined && c !== null) {
			populateSections(JSON.parse(c));
		}
	}

	function validateHeaders() {
		if (headers === null) {
			headers = new Headers();
			headers.append('Content-Type', 'application/json');
			headers.append('Authorization', 'Basic ' + process.env.basicAuthString);
		}
	}

	function loadDataFromServer() {
		validateHeaders();
		fetch(process.env.dataServer, {
			method: 'GET',
			headers: headers,
		}).then(r => r.json()).then(data => {
			populateSections(data.data);
			offline = false;
			afterInitialLoad = true;
			setCookie(data.data);
		}).catch(e => {
			userMessages.addError("Server unreachable. Using local date. Error:", e);
			loadCookie();
			setTimeout(loadDataFromServer, delayBetweenServerReachAttempts);
		});
	}

	function checkServerIsReachable() {
		validateHeaders();
		fetch(process.env.dataServer, {
			method: 'GET',
			headers: headers
		}).then(r => {
			if (r.ok) {
				userMessages.addMsg("Server Connection Established!");
				offline = false;
				saveEntries();
			} else
				setTimeout(checkServerIsReachable, delayBetweenServerReachAttempts);
		}).catch(() => setTimeout(checkServerIsReachable, delayBetweenServerReachAttempts))
	}

	function populateSections(data) {
		clearEntries();
		data.forEach(e => insertEntry(e, false));
	}

	function repopulateSections() {
		let allEntries = getAllEntries();
		populateSections(allEntries);
	}

	function clearEntries() {
		dailyEntries = [];
		weeklyEntries = [];
		futureEntries = [];
		generalEntries = [];
	}

	function saveEntries() {
		let allEntries = getAllEntries();
		setCookie(allEntries);
		validateHeaders();
		fetch(process.env.dataServer, {
			method: "POST",
			headers: headers,
			body: JSON.stringify(allEntries),
		}).
		then(r => {
			if (r.ok)
				userMessages.addMsg("Saved!");
			else {
				offline = true;
				userMessages.addError("save failed");
			}
		}).
		catch(err => {
			offline = true;
			userMessages.addError("save failed: ", err);
		});
	}

	function validateSorting() {
		const tdy = new Date();
		if (tdy.getDate() !== currentToday.getDate() &&
				tdy.getFullYear() !== currentToday.getFullYear() &&
				tdy.getMonth() !== currentToday.getMonth()) {
			currentToday = tdy;
			repopulateSections();
		}
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
			case SECTIONS.GENERAL:
				return generalEntries;
			default:
				userMessages.addError("could not get entries object from input: ", section);
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
			case SECTIONS.GENERAL:
				generalEntries = generalEntries;
				break;
			default:
				userMessages.addError("could not get entries object from input: ", section);
				return null;
		}
	}

	function sortSection(section) {
		let sectionObject = getEntriesObject(section);
		sectionObject.sort((a,b) => {
			if (a.date === b.date)
				return timeCompareFn(a.time,b.time);
			else
				return a.date - b.date;
		});
	}

	function insertEntryToSection(section, entry, saveChanges=true) {
		let sectionObject = getEntriesObject(section);
		sectionObject.push(entry);
		sortSection(section);
		updateSection(section).then(() => {
			if (saveChanges)
				saveEntries();
		});
	}

	function insertEntry(entry, saveChanges=true) {
		let section = SECTIONS.FUTURE;

		if (entry.date <= getDaysFromToday(7))
			section = SECTIONS.UPCOMING;
		if (entry.date <= getDaysFromToday(0))
			section = SECTIONS.DAILY;

		if (entry.time === undefined || entry.time === null) {  // new entry, no time def
			let lastSectionEntry = getLastEntry(section);
			if (lastSectionEntry === undefined)
				entry.Time = AutoTimeDefault;
			else
				entry.time = getNewTime(lastSectionEntry.time);
		}

		if (entry.date === NO_DATE) {
			section = SECTIONS.GENERAL;
		}
		insertEntryToSection(section, entry, saveChanges);
	}

	function getLastEntry(sectionName) {
		const entriesObj = getEntriesObject(sectionName);
		return entriesObj[entriesObj.length - 1];
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
		if (highestId === 0) {
			let highest = 0;
			const allEntries = getAllEntries();

			allEntries.forEach(e => {
				if (e.id > highest)
					highest = e.id;
			});
			highestId = highest;
		}
		highestId = highestId+1
		return highestId;
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
		let newEntry = {text: event.detail.text.trim(), id: generateNewId(),
			date: event.detail.date, time: event.detail.time};
		insertEntry(newEntry);
	}

	function handleDateChange(e) {
		let entryId = e.detail.entryId;
		let originSection = e.detail.section;
		let entry = getEntryById(originSection, entryId);
		removeEntryById(originSection, entryId, false);
		insertEntry(entry);
	}

	function handleDragDrop(e) {
		let entry = getEntryById(dragOrigin, draggedEntryId);
		removeEntryById(dragOrigin, draggedEntryId, false);
		entry.date = e.detail.targetDate;
		entry.time = e.detail.targetTime;
		insertEntry(entry);
	}

	function handleDragStart(e) {
		dragOrigin = e.detail.section;
		draggedEntryId = e.detail.entryId;
	}

</script>
<svelte:window on:focus={validateSorting}/>
<div class="app">
	<AppStatus bind:offline={offline}/>
	<Toast/>
	<Header/>
	{#if !afterInitialLoad}
		Server is unreachable!!
	{:else}
		<EntryInput on:new-entry={handleNewEntry}/>

		<GeneralEntries bind:entries={generalEntries}
						on:section-change={handleSectionChanged} />
		<SectionSeaprator/>

		<TodayEntries bind:entries={dailyEntries}
					   on:section-change={handleSectionChanged}
					   on:date-change={handleDateChange}
					   on:drag-start={handleDragStart}
					  on:drag-drop={handleDragDrop}
		/>

		<SectionSeaprator/>

		<UpcomingEntries bind:entries={weeklyEntries}
					   on:section-change={handleSectionChanged}
					   on:date-change={handleDateChange}
					   on:drag-start={handleDragStart}
					   on:drag-drop={handleDragDrop}
		/>

		<SectionSeaprator/>

		<FutureEntries bind:entries={futureEntries}
						  on:section-change={handleSectionChanged}
						  on:date-change={handleDateChange}
						  on:drag-start={handleDragStart}
						  on:drag-drop={handleDragDrop}
		/>
	{/if}
</div>