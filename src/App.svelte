<script>
	import {onMount} from 'svelte';
	import TodayEntries from './TodayEntries.svelte';
	import UpcomingEntries from './UpcomingEntries.svelte';
	import EntryInput from './EntryInput.svelte';
	import Header from './Header.svelte';

	let entries = {
		"Daily": [],
		"Weekly": [],
		};
	let draggedEntryId = 0;
	let draggedEntryOriginSection = "";

	onMount( async () => {
		await fetch("http://localhost:3333").
		then(r => r.json()).
		then( data => entries = data).
		catch( e => console.log("failed getting data", e));
	});

	function saveEntries() {
		fetch("http://localhost:3333", {
			method: "POST",
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(entries),
		}).then(r => r.json()).then(data => console.log("save success", data)).catch(err => console.log("save failed", err));
	}

	function getDefaultDate() {
		let today = new Date();
		return today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	}

	function getDefaultTime() {
		return "0000";
	}
	
	function handleNewEntry(event) {
		let newEntry = {text: event.detail, id: generateNewId(), date: getDefaultDate(), time: getDefaultTime()};

		if (isEntryUpcoming(event.detail)) {
			entries.Weekly = [...entries.Weekly, newEntry];
		} else {  // default is Today Section
			entries.Daily = [...entries.Daily, newEntry];
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
		Object.keys(entries).forEach( section => {
			entries[section].forEach( e => {
				if (e.id > highest)
					highest = e.id;
			});
		});
		return highest+1;
	}

	function handleDragDrop(e) {
		let targetSectionName = e.detail.targetSectionName;

		if (targetSectionName !== draggedEntryOriginSection) {
			let targetIndex = findEntryIndexById(entries[draggedEntryOriginSection], draggedEntryId);
			if (targetIndex !== -1) {
				let draggedEntry = entries[draggedEntryOriginSection][targetIndex];
				entries[targetSectionName] = [...entries[targetSectionName], draggedEntry];
				entries[draggedEntryOriginSection] = [...entries[draggedEntryOriginSection].slice(0, targetIndex), ...entries[draggedEntryOriginSection].slice(targetIndex + 1)];
			}
		}
		draggedEntryId = 0;
		draggedEntryOriginSection = "";
		saveEntries();
	}

	function findEntryIndexById(section, entryId) {
		for(let i = 0; i < section.length; i += 1) {
			if(section[i].id === entryId) {
				return i;
			}
		}
		return -1;
	}

	function handleDragStart(e) {
		draggedEntryId = e.detail.entryId;
		draggedEntryOriginSection = getSectionNameByEntryId(draggedEntryId);
	}

	function getSectionNameByEntryId(entryId) {
		let sections = Object.keys(entries);
		for (let section of sections) {
			if (entries[section].some( e => e.id === entryId))
				return section;
		}
	}

</script>

<style>
</style>

<div class="app">
	<Header/>
	<EntryInput on:new-entry={handleNewEntry}/>
	<TodayEntries bind:entries={entries.Daily} on:section-changed={saveEntries} on:drag-drop={handleDragDrop} on:drag-start={handleDragStart}/>
	<UpcomingEntries bind:entries={entries.Weekly} on:section-changed={saveEntries} on:drag-drop={handleDragDrop} on:drag-start={handleDragStart}/>
</div>