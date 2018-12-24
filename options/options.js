/* global browser, updateExample, getThing, saveThing, ADD_SPACE_HEX, LS_KEY_OPEN, LS_KEY_DATE, LS_KEY_FORGET, LS_KEY_HEX, LS_KEY_TEXT, LS_KEY_TIME */

//browser.storage.sync.clear();
//console.log('cleared settings');

// load date format setting on startup
getThing(LS_KEY_DATE, (formatSetting) => {
	if (!formatSetting) {
		const reset_format = reset_date();
		document.querySelector('#dateFormat').value = reset_format;		// default
	} else {
		document.querySelector('#dateFormat').value = formatSetting;
	}
	updateExample();
});

// load forget setting on startup
getThing(LS_KEY_FORGET, (forgetSetting) => {
	if (forgetSetting === document.getElementById('memorySetting1').value) {
		document.getElementById('memorySetting1').checked = true;
		browser.storage.sync.remove(LS_KEY_TEXT);
		browser.storage.sync.remove(LS_KEY_TIME);
	} else if (forgetSetting === document.getElementById('memorySetting2').value) {
		document.getElementById('memorySetting2').checked = true;
	} else if (forgetSetting === document.getElementById('memorySetting3').value) {
		document.getElementById('memorySetting3').checked = true;
	} else {
		document.getElementById('memorySetting2').checked = true;		// default
	}
});

// load hex space setting
getThing(LS_KEY_HEX, (hexSetting) => {
	if (hexSetting === undefined || hexSetting === null) {
		document.getElementById('hexSpace').checked = ADD_SPACE_HEX;	// default
	} else {
		document.getElementById('hexSpace').checked = hexSetting;
	}
});

// load auto open setting
getThing(LS_KEY_OPEN, (autoOpen) => {
	if (autoOpen === undefined || autoOpen === null) {
		document.getElementById('autoOpen').checked = false;			// default
	} else {
		document.getElementById('autoOpen').checked = autoOpen;
	}
});

// something was clicked
document.addEventListener('click', (e) => {
	if (e.target.id === 'reset') {
		reset_date();
		flash_save();
	}

	if (e.target.classList.contains('forget')) {
		let val = '?';
		if (document.getElementById('memorySetting1').checked) {
			val = document.getElementById('memorySetting1').value;
		}
		if (document.getElementById('memorySetting2').checked) {
			val = document.getElementById('memorySetting2').value;
		}
		if (document.getElementById('memorySetting3').checked) {
			val = document.getElementById('memorySetting3').value;
		}
		saveThing(LS_KEY_FORGET, val);
		flash_save();
	}

	if (e.target.id === 'hexSpace') {
		saveThing(LS_KEY_HEX, document.getElementById('hexSpace').checked);
		flash_save();
	}

	if (e.target.id === 'autoOpen') {
		saveThing(LS_KEY_OPEN, document.getElementById('autoOpen').checked);
		flash_save();
	}
});

// a key was pressed
document.addEventListener('keyup', e => {
	if (e.target.id === 'dateFormat') {
		updateExample();
		saveThing(LS_KEY_DATE, document.getElementById('dateFormat').value);
		flash_save();
	}
});

// flash a save message
function flash_save() {
	document.querySelector('#saved').classList.remove('hidden');
	setTimeout(function () {
		document.querySelector('#saved').classList.add('hidden');
	}, 1000);
}

// reset the date format
function reset_date() {
	console.log('resetting or initing date format');
	const RESET = '%q %d, %Y %I:%m%p';
	document.getElementById('dateFormat').value = RESET;
	saveThing(LS_KEY_DATE, document.getElementById('dateFormat').value);
	return RESET;
}
