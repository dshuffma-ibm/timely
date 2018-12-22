/* eslint no-bitwise: 0 */
/* global formatDate, getThing, saveThing, LS_KEY_DATE, LS_KEY_TIME, LS_KEY_HEX, LS_KEY_FORGET, EXPIRATION, FORMAT, ADD_SPACE_HEX, LS_KEY_TEXT */
let auto_ts_units = true;
let use_offset = true;
updateNow();
listenHereSon();
showUnits('ms');
updateOffsetText();

getThing(LS_KEY_DATE, (fmt) => {
	if (fmt) {
		FORMAT = fmt;
	}
	console.log('[settings] date format setting', FORMAT);
});

getThing(LS_KEY_HEX, (setting) => {
	if (setting !== 'undefined' && setting !== null) {
		ADD_SPACE_HEX = setting;
	}
	console.log('[settings] hex space setting', ADD_SPACE_HEX);
});

getThing(LS_KEY_FORGET, (forgetSetting) => {
	if (forgetSetting === 'onclose') {
		EXPIRATION = 0;
	}
	if (forgetSetting === 'minutes') {
		EXPIRATION = 1000 * 60 * 5;
	}
	if (forgetSetting === 'forever') {
		EXPIRATION = Date.now() * 2;		// any distance future timestamp
	}
	console.log('[settings] forget expiration setting', EXPIRATION);
});

// retrieve past input text if available
getThing(LS_KEY_TEXT, (text) => {
	if (text !== 'undefined') {
		console.log('[text] loading input text');
		document.getElementById('inputText').innerText = text;
	}
});

// retrieve past input timestamp if available
getThing(LS_KEY_TIME, (timestamp) => {
	if (timestamp !== 'undefined') {
		console.log('[text] loading input text');
		document.getElementById('inputTs').value = timestamp;
	}
});

// update everything all the time
setInterval(function () {
	try {
		convert4humans();
		updateNow();
	} catch (e) {
		console.error(e);
	}
}, 300);

document.getElementById('inputTs').focus();

// listen for click and keyboard events
function listenHereSon() {
	document.addEventListener('keyup', e => {
		if (e.target.id === 'inputTs') {
			convert4humans();
			updateNow();
			saveThing(LS_KEY_TIME, document.getElementById('inputTs').value, true);
		}

		if (e.target.id === 'inputText') {
			countText();
			saveThing(LS_KEY_TEXT, document.getElementById('inputText').innerText, true);
		}
	});

	document.addEventListener('click', (e) => {

		// toggle auto/sec units button
		if (e.target.id === 'unitsButton') {
			console.log('[button] clicked the change units button');
			if (auto_ts_units === true) {
				auto_ts_units = false;
			} else {
				auto_ts_units = true;
			}
			showUnits('sec');
		}

		// toggle utc vs local time zone
		if (e.target.id === 'toggleOffsetButton') {
			use_offset = !use_offset;
			updateOffsetText();
		}

		// format text buttons
		try {
			let textInput = document.getElementById('inputText').innerText;
			document.querySelector('#inputText').classList.remove('jsonError');
			if (e.target.classList.contains('encode64')) {
				document.querySelector('#inputText').innerText = b64(textInput);
			} else if (e.target.classList.contains('decode64')) {
				document.querySelector('#inputText').innerText = fromB64(textInput);
			} else if (e.target.classList.contains('encodeTxt')) {
				document.querySelector('#inputText').innerText = encodeChars(textInput);
			} else if (e.target.classList.contains('decodeTxt')) {
				document.querySelector('#inputText').innerText = decodeChars(textInput);
			} else if (e.target.classList.contains('pretty')) {
				document.querySelector('#inputText').innerHTML = prettyPrint(textInput);
				let text = document.getElementById('inputText').innerText;
				if (text.indexOf('%3C') >= 0) {
					document.querySelector('#inputText').innerText = urlDecode(text);
				}
			} else if (e.target.classList.contains('stringify')) {
				document.querySelector('#inputText').innerText = stringify(textInput);
			} else if (e.target.classList.contains('urlEncode')) {
				document.querySelector('#inputText').innerText = urlEncode(textInput);
			} else if (e.target.classList.contains('urlDecode')) {
				document.querySelector('#inputText').innerText = urlDecode(textInput);
			} else if (e.target.classList.contains('hexStr')) {
				document.querySelector('#inputText').innerText = strToHexStr(textInput);
			} else if (e.target.classList.contains('str')) {
				document.querySelector('#inputText').innerText = hexStrToStr(textInput);
			} else if (e.target.classList.contains('sort')) {
				document.querySelector('#inputText').innerHTML = sortInput(textInput);
			} else if (e.target.classList.contains('copy')) {
				copyTextButton(textInput);
				document.querySelector('#inputText').classList.add('success');
				setTimeout(() => {
					document.querySelector('#inputText').classList.remove('success');
				}, 200);
			}
		} catch (e) {
			console.error(e);
			document.querySelector('#inputText').classList.add('jsonError');
		}
		countText();
		saveThing(LS_KEY_TEXT, document.getElementById('inputText').innerText, true);

		// open format text panel
		if (e.target.classList.contains('openTextPanel')) {
			console.log('[button] clicked the open text format panel button');
			document.querySelector('.openPanelWrap').classList.add('hidden');
			document.querySelector('#textPanel').classList.remove('hidden');
			document.getElementById('inputText').focus();
		}

		// toggle word wrap
		if (e.target.classList.contains('wwClick')) {
			console.log('[button] clicked the word wrap button');
			if (!document.getElementById('wordWrap').checked) {
				document.querySelector('#inputText').classList.remove('enableWrap');
			} else {
				document.querySelector('#inputText').classList.add('enableWrap');
			}
		}

		// toggle auto/sec units button
		if (e.target.classList.contains('timestampClick')) {
			console.log('[button] clicked to copy timestamp');
			copyTextButton(document.querySelector('#now').innerText);
			document.querySelector('#timestampWrap').classList.add('success');
			setTimeout(() => {
				document.querySelector('#timestampWrap').classList.remove('success');
			}, 200);
		}
	});
}

// convert the ts in the input box to a human friendly string
function convert4humans() {
	let rawInput = document.getElementById('inputTs').value;
	let ts_ms = 0;
	if (rawInput === '') {
		updateIfDiff('#output', '-');
	} else {
		let obj = parse_2_number(rawInput);
		if (obj.type === 'date') {									// if a date's provided show the ts in output
			ts_ms = obj.value.getTime();
			updateIfDiff('#output', obj.value.getTime());
			showUnits('date');
			document.querySelector('#output').classList.remove('error');
		} else {													// if a number is provided show the date in the output
			ts_ms = conform_2_ms(rawInput);
			let formated = formatDate(ts_ms, FORMAT);
			if (formated) {
				document.querySelector('#output').classList.remove('error');
			} else {
				document.querySelector('#output').classList.add('error');
				formated = 'Try again bud, like a number this time';
			}
			updateIfDiff('#output', formated);
		}
		let diff = ts_ms - Date.now();
		document.querySelector('#elapsed').innerText = friendlyMs(diff);
	}
}

// update the current ts and date (right NOW)
function updateNow() {
	let rightNow = Date.now();
	updateIfDiff('#nowFriendly', formatDate(rightNow, FORMAT));
	document.querySelector('#now').innerText = rightNow.toString().trim();
}

// show the timestamp units we are using
function showUnits(units) {
	if (auto_ts_units) {
		units = 'auto (' + units + ')';
	}
	document.querySelector('#unitsButton').innerText = units;
}

// see if we can consume this input... (date -> number), (number -> number), (bad -> null)
function parse_2_number(raw) {
	if (isNaN(raw)) {									// oh boy
		let d = new Date(raw);							// see if date can parse it
		let number = d.getTime();
		if (isNaN(number)) {
			return { type: null, value: null };			// it couldn't be helped, error out
		} else {
			return { type: 'date', value: d };
		}
	} else {
		return { type: 'number', value: raw };
	}
}

// bring it to ms if its not already
function conform_2_ms(number) {
	if (isNaN(number)) {
		return null;
	} else {
		number = Number(number);
		if (auto_ts_units === true) {
			if (number >= 10000000000) {
				showUnits('ms');
				return number;
			} else {
				showUnits('sec');
				return number * 1000;
			}
		}
		return number * 1000;
	}
}

// convert to ms to friendly 0.0 units
function friendlyMs(ms) {
	let ret = '';
	let neg = 1;
	if (isNaN(ms)) {
		ret = '? sec';
	} else {
		if (ms <= 0) {
			ms = -ms;
			neg = -1;
		}
		if (ms > 365 * 24 * 60 * 60 * 1000) { 		// format for years
			ret = (ms * neg / 1000 / 60 / 60 / 24 / 365).toFixed(1) + ' years';
		} else if (ms > 24 * 60 * 60 * 1000) { 		// format for days
			ret = (ms * neg / 1000 / 60 / 60 / 24).toFixed(1) + ' days';
		} else if (ms > 60 * 60 * 1000) { 			// format for hours
			ret = (ms * neg / 1000 / 60 / 60).toFixed(1) + ' hrs';
		} else if (ms > 60 * 1000) { 				// format for mins
			ret = (ms * neg / 1000 / 60).toFixed(1) + ' mins';
		} else if (ms > 1000) { 					// format for secs
			ret = (ms * neg / 1000).toFixed(1) + ' secs';
		} else { 									// format to ms
			ret = ms + ' ms';
		}
	}
	if (neg === 1) {
		ret = '+' + ret;
	}
	return ret;
}

// update the html of the element if it's value has changed, else leave it alone
function updateIfDiff(id, str) {
	str = str.toString().trim();
	let currently = document.querySelector(id).innerText;
	if (currently !== str) {
		document.querySelector(id).innerText = str;
	}
}

// update the offset text
function updateOffsetText() {
	if (use_offset) {
		document.querySelector('#offset').innerText = 'UTC -' + (Number((new Date()).getTimezoneOffset()) / 60).toFixed(0);
		document.querySelector('#toggleOffsetButton').innerText = 'Use UTC';
	} else {
		document.querySelector('#offset').innerText = 'UTC + 0';
		document.querySelector('#toggleOffsetButton').innerText = 'Use Local';
	}
}

// encode base 64
function b64(text) {
	return btoa(text);
}

// decode base 64
function fromB64(text) {
	return atob(text);
}

// encode chars
function encodeChars(text) {
	let temp = JSON.stringify(text).replace(/\\"/g, '"');
	return temp.substring(1, 1) + temp.substring(1, temp.length - 1);
}

// decode chars
function decodeChars(text) {
	return text.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
}

// pretty print JSON
function prettyPrint(text) {
	const obj = betterParse(text);
	return stringMeUp(obj);
}

// stringify JSON
function stringify(text) {
	const obj = betterParse(text);
	return JSON.stringify(obj);
}

// encode the text for a url
function urlEncode(text) {
	return encodeURIComponent(text);
}

// decode the text from a url
function urlDecode(text) {
	return decodeURIComponent(text);
}

// pretty print json
function stringMeUp(json, spacing) {
	let ret = '{\n';
	let keyNum = 0;
	spacing = (spacing) ? spacing + '\t' : '\t';

	if (json === null || typeof json !== 'object') {
		return '<u>' + JSON.stringify(json, null, '\t') + '</u>';
	} else {
		if (Array.isArray(json)) {
			ret = '[\n';
			ret += arrayParsing(json, spacing);
			return ret;
		} else {
			for (let key in json) {
				keyNum++;
				const s_key = makeSafe(key);
				const s_value = makeSafe(json[key]);
				if (typeof json[key] === 'string') {										// she's a string
					ret += spacing + '"<b>' + s_key + '</b>": "<u>' + s_value + '</u>"';
				} else if (typeof json[key] === 'number') {									// she's a number
					ret += spacing + '"<b>' + s_key + '</b>": <i>' + s_value + '</i>';
				} else if (typeof json[key] === 'boolean') {								// she's a liar
					ret += spacing + '"<b>' + s_key + '</b>": <strong>' + s_value + '</strong>';
				} else if (json[key] === null) {											// she's tricky
					ret += spacing + '"<b>' + s_key + '</b>": <i>null</i>';
				} else if (typeof json[key] === 'object' && !Array.isArray(json[key])) {	// she's an object
					ret += spacing + '"<b>' + s_key + '</b>": ' + stringMeUp(json[key], spacing);
				} else if (Array.isArray(json[key])) {										// she's an array
					ret += spacing + '"<b>' + s_key + '</b>": [\n';
					ret += arrayParsing(json[key], spacing);
				} else {
					console.log('what the hell is this', typeof json[key], json[key]);
					ret += spacing + '"<b>' + s_key + '</b>": ' + JSON.stringify(json[key], null, '\t');
				}

				if (keyNum < Object.keys(json).length) {				// last one does not get a comma
					ret += ',\n';
				} else {
					ret += '\n';
				}
			}
		}
	}
	return ret + spacing.slice(0, -1) + '}';

	// arrays
	function arrayParsing(arr, spacing) {
		let ret = '';
		let arrayPos = 0;
		spacing += '\t';

		for (let i in arr) {
			arrayPos++;
			const s_value = makeSafe(arr[i]);
			if (typeof arr[i] === 'string') {									// he's a string
				ret += spacing + '"<u>' + s_value + '</u>"';
			} else if (typeof arr[i] === 'number') {							// he's a number
				ret += spacing + '<i>' + s_value + '</i>';
			} else if (typeof arr[i] === 'boolean') {							// he's a boolean
				ret += spacing + '<strong>' + s_value + '</strong>';
			} else if (arr[i] === null) {										// he's null
				ret += spacing + '<i>null</i>';
			} else if (typeof arr[i] === 'object' && !Array.isArray(arr[i])) {	// he's an object
				ret += spacing + stringMeUp(arr[i], spacing);
			} else if (Array.isArray(arr[i])) {									// he's an array
				ret += spacing + '[\n';
				ret += arrayParsing(arr[i], spacing);
			}
			if (arrayPos < arr.length) {						// last one does not get a comma
				ret += ',\n';
			} else {
				ret += '\n';
			}
		}

		spacing = spacing.slice(0, -1);
		ret += spacing + ']';
		return ret;
	}
}

// remove < and > to defeat xss
function makeSafe(html) {
	if (html && html.replace) {
		return html.replace(/</g, '%3C').replace(/>/g, '%3E');
	}
	return html;
}

// convert string to hex
function strToHexStr(str) {
	let ret = '';
	for (let pos in str) {
		let temp = str.charCodeAt(pos).toString(16).toUpperCase();
		if (temp.length <= 1) {
			temp = '0' + temp;							// left pad a '0'
		}
		ret += temp;
		if (ADD_SPACE_HEX) {
			ret += ' ';
		}
	}
	return ret.trim();
}

// convert hex string to string
function hexStrToStr(hex) {
	let ret = '';
	hex = hex.replace(/\s/g, '');
	for (let i = 0; i < hex.length;) {
		let temp = parseInt(hex[i] + hex[i + 1], 16);
		ret += String.fromCharCode(temp & 255);
		i += 2;
	}
	return ret.trim();
}

// count and display the number of characters
function countText() {
	let textInput = document.getElementById('inputText').innerText;
	document.querySelector('#textCount').innerText = textInput.length + ' characters';
	if (textInput.length === 0) {
		document.querySelector('#hint').classList.remove('hidden');
	} else {
		document.querySelector('#hint').classList.add('hidden');
	}
}

// copy text to clip board
function copyTextButton(text) {
	const el = document.createElement('textarea');
	el.value = text;
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
}

// try to parse it into an object or die trying
function betterParse(text) {
	try {
		// first attempt - try as is
		return JSON.parse(text);
	} catch (e) {
		// second attempt - try removing white space things
		text = text.replace(/[\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/g, '');
		return JSON.parse(text);
	}
}

// sort input str
function sortInput(text) {
	let temp = '';
	const obj = betterParse(text);
	temp = JSON.stringify(sortItOut(obj));			// sort it
	text = prettyPrint(temp);
	return text;
}

// sort an object
function sortItOut(unsorted) {
	let ordered = {};
	if (isObject(unsorted)) {
		Object.keys(unsorted).sort(compareStrings).forEach(function (key) {
			ordered[key] = unsorted[key];							//sort all the object's keys
		});
	} else {
		try {
			ordered = unsorted.sort(compareStrings);				//sort the array of strings
		} catch (e) {
			ordered = unsorted.sort();								//sort the mixed array
		}
	}

	for (let i in ordered) {
		if (isObject(ordered[i])) {
			ordered[i] = sortItOut(ordered[i]);						//sort all the object's object's keys
		} else if (Array.isArray(ordered[i])) {
			for (let z in ordered[i]) {
				if (ordered[i][z] && isObject(ordered[i][z])) {
					ordered[i][z] = sortItOut(ordered[i][z]);		//sort the inner object
				}
			}

			try {
				ordered[i] = ordered[i].sort(compareStrings);		//sort the array of strings
			} catch (e) {
				ordered[i] = ordered[i].sort();						//sort the array of ?
			}
		}
	}
	return ordered;

	function compareStrings(a, b) {
		return a.localeCompare(b, { usage: 'sort', numeric: true, caseFirst: 'upper' });
	}
	function isObject(o) {
		return o instanceof Object && o.constructor === Object;
	}
}
