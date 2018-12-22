/* global updateExample, getThing, saveThing, FORMAT, ADD_SPACE_HEX, SETTING_DATE, SETTING_FORGET, SETTING_HEX */

// load date format setting on startup
getThing(SETTING_DATE, (formatSetting) => {
	if (!formatSetting) {
		document.querySelector('#dateFormat').value = FORMAT;
	} else {
		document.querySelector('#dateFormat').value = formatSetting;
	}
	updateExample();
});

// load forget setting on startup
getThing(SETTING_FORGET, (forgetSetting) => {
	if (forgetSetting === document.getElementById('memorySetting1').value) {
		document.getElementById('memorySetting1').checked = true;
	} else if (forgetSetting === document.getElementById('memorySetting2').value) {
		document.getElementById('memorySetting2').checked = true;
	} else if (forgetSetting === document.getElementById('memorySetting3').value) {
		document.getElementById('memorySetting3').checked = true;
	} else {
		document.getElementById('memorySetting2').checked = true;		// default
	}
});

// load hex space setting
getThing(SETTING_HEX, (hexSetting) => {
	if (hexSetting === 'undefined' || hexSetting === null) {
		document.getElementById('hexSpace').checked = ADD_SPACE_HEX;
	} else {
		document.getElementById('hexSpace').checked = hexSetting;
	}
});

// something was clicked
document.addEventListener('click', (e) => {
	if (e.target.id === 'reset') {
		document.getElementById(SETTING_DATE).value = '%q %d, %Y %I:%m%p';
		saveThing(SETTING_DATE, document.getElementById('dateFormat').value);
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
		saveThing(SETTING_FORGET, val);
		flash_save();
	}

	if (e.target.id === 'hexSpace') {
		saveThing(SETTING_HEX, document.getElementById('hexSpace').checked);
		flash_save();
	}
});

// a key was pressed
document.addEventListener('keyup', e => {
	if (e.target.id === 'dateFormat') {
		updateExample();
		saveThing(SETTING_DATE, document.getElementById('dateFormat').value);
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
