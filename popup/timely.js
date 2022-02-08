/* eslint no-bitwise: 0 */
/* global formatDate, getThing, saveThing, LS_KEY_DATE, LS_KEY_TIME, LS_KEY_HEX, LS_KEY_OPEN, LS_KEY_FORGET, LS_KEY_TEXT, LS_KEY_ENDINGS */
/* global formatDate, getThing, saveThing, EXPIRATION, FORMAT, ADD_SPACE_HEX, LINE_ENDING, fixJson, breakMeDown */


let ASN1 = null;
let Base64 = null;
let Hex = null;

(typeof define != 'undefined' ? define : function (factory) {
	'use strict';
	if (typeof module == 'object') module.exports = factory(function (name) { return require(name); });
	else window.asn1 = factory(function (name) { return window[name.substring(2)]; });
})(function (require) {
	"use strict";

	ASN1 = require('./asn1');
	Base64 = require('./base64');
	Hex = require('./hex');
});

let auto_ts_units = true;
let use_offset = true;
let prev_text = '';
let fixed_text = '';

if (!window.testing) {
	console.log('[start] starting timely...');
	updateNow();
	listenHereSon();
	showUnits('ms');
	updateOffsetText();

	// -------------------------------------------------------------
	// when debugging uncomment this block
	/*let textInput = document.getElementById('inputText').innerText;
	document.querySelector('#inputText').innerHTML = prettyPrint(line_endings(textInput));
	let text = document.getElementById('inputText').innerText;
	if (text.indexOf('%3C') >= 0) {
		document.querySelector('#inputText').innerText = urlDecode(text);
	}
	openTextFormatter();*/

	// -------------------------------------------------------------

	getThing(LS_KEY_DATE, (fmt) => {
		if (fmt) {
			FORMAT = fmt;
		}
		console.log('[settings] date format setting', FORMAT);
	});

	getThing(LS_KEY_HEX, (setting) => {
		if (setting !== undefined && setting !== null) {
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

	getThing(LS_KEY_OPEN, (autoOpen) => {
		if (autoOpen === true) {
			console.log('[auto-open] opening text formatter panel');
			openTextFormatter();
		}
		console.log('[settings] hex space setting', autoOpen);
	});

	// retrieve past input text if available
	getThing(LS_KEY_TEXT, (text) => {
		if (text !== undefined) {
			console.log('[text] loading input text');
			document.getElementById('inputText').innerText = text;
		}
	});

	// retrieve past input timestamp if available
	getThing(LS_KEY_TIME, (timestamp) => {
		if (timestamp !== undefined) {
			console.log('[text] loading input text');
			document.getElementById('inputTs').value = timestamp;
		}
	});

	// retrieve line endings setting
	getThing(LS_KEY_ENDINGS, (lineEndings) => {
		if (lineEndings !== undefined) {
			console.log('[settings] loading line endings');
			LINE_ENDING = lineEndings;
		}
	});

	// update everything all the time
	setInterval(function () {
		try {
			convert4humans();
			updateNow();

			// hide or show the scroll to top button
			const top = document.getElementById('htmlId').scrollTop;
			if (top >= 120) {
				document.querySelector('#scroll2top').classList.remove('hidden');
			} else {
				document.querySelector('#scroll2top').classList.add('hidden');
			}
		} catch (e) {
			console.error(e);
		}
	}, 300);

	document.getElementById('inputTs').focus();
}

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

	// json key locator events
	document.getElementById('inputText').addEventListener('click', (e) => {
		let location = e.target.getAttribute('loc');
		if (location) {
			let key = e.target.innerText;
			console.log('[json] clicked key:', key, 'loc:', location);

			document.querySelector('#jsonKeyLocation').innerText = location;
			document.querySelector('#copyKeyIcon').classList.remove('hidden');
			const keys = document.querySelectorAll('.selectedKey');
			for (let i in keys) {
				if (keys[i] && keys[i].classList) {
					keys[i].classList.remove('selectedKey');			// remove prev selected keys classes
				}
			}

			e.target.classList.add('selectedKey');						// color this key

			let tmp = location;
			for (let i = 0; tmp.length > 0; i++) {						// color parent keys
				const pos = tmp.lastIndexOf('.');
				const posBracket = tmp.lastIndexOf(']');
				if (posBracket > pos) {									// if ] bracket is after dot then an array is next
					const posBracket2 = tmp.lastIndexOf('[');
					tmp = tmp.substring(0, posBracket2);
				} else {
					tmp = tmp.substring(0, pos);
				}
				try {
					document.querySelector('[loc="' + tmp + '"]').classList.add('selectedKey');
				} catch (e) { }
			}
		}
	});

	// toggle auto/sec units button
	document.querySelector('#copyKeyIcon').addEventListener('click', (e) => {
		console.log('[button] clicked to copy json key location');
		copyTextButton(document.querySelector('#jsonKeyLocation').innerText);
		document.querySelector('#jsonKeyWrap').classList.add('success');
		setTimeout(() => {
			document.querySelector('#jsonKeyWrap').classList.remove('success');
		}, 200);
	});

	// most buttons here
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

		// scroll to top
		if (e.target.id === 'scroll2top') {
			document.getElementById('htmlId').scrollTop = 0;
			return;
		}

		// format text buttons
		try {
			let textInput = document.getElementById('inputText').innerText;
			document.querySelector('#inputText').classList.remove('jsonError');
			if (e.target.classList.contains('encode64')) {
				document.querySelector('#inputText').innerText = b64(line_endings(textInput));
			} else if (e.target.classList.contains('decode64')) {
				document.querySelector('#inputText').innerText = fromB64(line_endings(textInput));
			} else if (e.target.classList.contains('encodeTxt')) {
				document.querySelector('#inputText').innerText = encodeChars(line_endings(textInput));
			} else if (e.target.classList.contains('decodeTxt')) {
				document.querySelector('#inputText').innerText = decodeChars(line_endings(textInput));
			} else if (e.target.classList.contains('pretty')) {
				document.querySelector('#inputText').innerHTML = prettyPrint(line_endings(textInput));
				document.querySelector('#jsonKeyWrap').classList.remove('hidden');
				let text = document.getElementById('inputText').innerText;
				if (text.indexOf('%3C') >= 0) {
					document.querySelector('#inputText').innerText = urlDecode(text);
				}
			} else if (e.target.classList.contains('stringify')) {
				document.querySelector('#inputText').innerText = stringify(line_endings(textInput));
			} else if (e.target.classList.contains('urlEncode')) {
				document.querySelector('#inputText').innerText = urlEncode(line_endings(textInput));
			} else if (e.target.classList.contains('urlDecode')) {
				document.querySelector('#inputText').innerText = urlDecode(line_endings(textInput));
			} else if (e.target.classList.contains('hexStr')) {
				document.querySelector('#inputText').innerText = strToHexStr(line_endings(textInput));
			} else if (e.target.classList.contains('str')) {
				document.querySelector('#inputText').innerText = hexStrToStr(line_endings(textInput));
			} else if (e.target.classList.contains('sort')) {
				document.querySelector('#inputText').innerHTML = sortInput(line_endings(textInput), true);
			} else if (e.target.classList.contains('sortKeys')) {
				document.querySelector('#inputText').innerHTML = sortInput(line_endings(textInput), false);
			} else if (e.target.classList.contains('escape')) {
				document.querySelector('#inputText').innerHTML = escapeIt(line_endings(textInput));
			} else if (e.target.classList.contains('unescape')) {
				document.querySelector('#inputText').innerHTML = unescapeIt(line_endings(textInput));
			} else if (e.target.classList.contains('clear')) {
				document.querySelector('#inputText').innerHTML = '';
				document.querySelector('.accept').classList.add('hidden');
				document.querySelector('.undo').classList.add('hidden');
			} else if (e.target.classList.contains('js2json')) {
				document.querySelector('#inputText').innerHTML = prettyPrint(js2json(line_endings(textInput)));
				document.querySelector('#jsonKeyWrap').classList.remove('hidden');
			} else if (e.target.classList.contains('json2js')) {
				document.querySelector('#inputText').innerHTML = json2js(line_endings(textInput));
			} else if (e.target.classList.contains('asn1')) {
				document.querySelector('#inputText').innerHTML = decodeAsn1(line_endings(textInput));
			} else if (e.target.classList.contains('fixJson')) {
				try {
					document.querySelector('#inputText').innerHTML = prettyPrint(js2json(line_endings(textInput)));
				} catch (e) {
					prev_text = textInput;
					fixed_text = fixJson(line_endings(textInput));
					const fixed_obj = JSON.parse(fixed_text);								// test the fix
					const diff = document.querySelector('#inputText').innerHTML = breakMeDown(prev_text, JSON.stringify(fixed_obj, null, 2));
					document.querySelector('.accept').classList.remove('hidden');
					document.querySelector('.undo').classList.remove('hidden');
					document.querySelector('#inputText').innerHTML = diff;
				}
			} else if (e.target.classList.contains('undo')) {
				document.querySelector('#inputText').innerHTML = prev_text;
				document.querySelector('.accept').classList.add('hidden');
				document.querySelector('.undo').classList.add('hidden');
			} else if (e.target.classList.contains('accept')) {
				document.querySelector('#inputText').innerHTML = prettyPrint(fixed_text);
				document.querySelector('.accept').classList.add('hidden');
				document.querySelector('.undo').classList.add('hidden');
			} else if (e.target.classList.contains('stripHtml')) {
				document.querySelector('#inputText').innerText = textInput;
			} else if (e.target.classList.contains('copy')) {
				document.querySelector('#inputText').classList.add('success');
				copyTextButton(line_endings(textInput));
				setTimeout(() => {
					document.querySelector('#inputText').classList.remove('success');
				}, 350);
			}
		} catch (e) {
			console.error(e);
			document.querySelector('#inputText').classList.add('jsonError');
			document.querySelector('#jsonKeyLocation').innerText = '-- click a key to locate it --';
			document.querySelector('#jsonKeyWrap').classList.add('hidden');
		}
		countText();
		saveThing(LS_KEY_TEXT, document.getElementById('inputText').innerText, true);

		// open format text panel
		if (e.target.classList.contains('openTextPanel')) {
			console.log('[button] clicked the open text format panel button');
			openTextFormatter();
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

// open the text format section
function openTextFormatter() {
	document.querySelector('.openPanelWrap').classList.add('hidden');
	document.querySelector('#textPanel').classList.remove('hidden');
	document.getElementById('inputText').focus();
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
				formated = 'Try again bud, like a number';
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
	text = decodeChars(text);		// if you decode first we won't aggregate extra slashes
	let temp = JSON.stringify(text).replace(/\\"/g, '"');
	return temp.substring(1, 1) + temp.substring(1, temp.length - 1);
}

// decode chars
function decodeChars(text) {
	return text.replace(/\\r\\n/g, '\\n').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
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
function stringMeUp(json, spacing, loc) {
	let ret = '{\n';
	let keyNum = 0;										// starts from 0 on each recursion call
	spacing = (spacing) ? spacing + '\t' : '\t';
	loc = loc ? loc : '';

	if (json === null || typeof json !== 'object') {
		return '<u>' + JSON.stringify(json, null, '\t') + '</u>';
	} else {
		if (Array.isArray(json)) {
			ret = '[\n';
			ret += arrayParsing(json, spacing, '.' + loc);
			return ret;
		} else {
			for (let key in json) {
				keyNum++;
				const s_key = makeSafe(key);
				const s_value = makeSafe(json[key]);
				let my_loc = loc + '.' + key;
				let attrs = 'loc="' + my_loc.substring(1) + '"';

				if (typeof json[key] === 'string') {										// she's a string
					ret += spacing + '"<b ' + attrs + '>' + s_key + '</b>": "<u>' + s_value + '</u>"';
				} else if (typeof json[key] === 'number') {									// she's a number
					ret += spacing + '"<b ' + attrs + '>' + s_key + '</b>": <i>' + s_value + '</i>';
				} else if (typeof json[key] === 'boolean') {								// she's a liar
					ret += spacing + '"<b ' + attrs + '>' + s_key + '</b>": <strong>' + s_value + '</strong>';
				} else if (json[key] === null) {											// she's tricky
					ret += spacing + '"<b ' + attrs + '>' + s_key + '</b>": <i>null</i>';
				} else if (typeof json[key] === 'object' && !Array.isArray(json[key])) {	// she's an object
					ret += spacing + '"<b ' + attrs + '>' + s_key + '</b>": ' + stringMeUp(json[key], spacing, loc + '.' + key);
				} else if (Array.isArray(json[key])) {										// she's an array
					ret += spacing + '"<b ' + attrs + '>' + s_key + '</b>": [\n';
					ret += arrayParsing(json[key], spacing, loc + '.' + key);
				} else {
					console.error('what the hell is this', typeof json[key], json[key]);
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
	function arrayParsing(arr, spacing, loc) {
		let ret = '';
		let arrayPos = 0;
		spacing += '\t';
		loc += '[';

		for (let i in arr) {
			arrayPos++;
			let my_loc = loc + i + ']';
			let attrs = ' loc="' + my_loc.substring(1) + '"';

			const s_value = makeSafe(arr[i]);
			if (typeof arr[i] === 'string') {									// he's a string
				ret += spacing + '"<u ' + attrs + '>' + s_value + '</u>"';
			} else if (typeof arr[i] === 'number') {							// he's a number
				ret += spacing + '<i ' + attrs + '>' + s_value + '</i>';
			} else if (typeof arr[i] === 'boolean') {							// he's a boolean
				ret += spacing + '<strong ' + attrs + '>' + s_value + '</strong>';
			} else if (arr[i] === null) {										// he's null
				ret += spacing + '<i ' + attrs + '>null</i>';
			} else if (typeof arr[i] === 'object' && !Array.isArray(arr[i])) {	// he's an object
				ret += spacing + stringMeUp(arr[i], spacing, my_loc);
			} else if (Array.isArray(arr[i])) {									// he's an array
				ret += spacing + '[\n';
				ret += arrayParsing(arr[i], spacing, my_loc);
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
		// second attempt - try removing special white space things with normal white space
		text = text.replace(/[\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/g, ' ');
		return JSON.parse(text);
	}
}

// sort input str
function sortInput(text, sort_arrays) {
	let temp = '';
	const obj = betterParse(text);
	temp = JSON.stringify(sortItOut(obj, sort_arrays));				// sort it
	text = prettyPrint(temp);
	return text;
}

// sort an object
function sortItOut(unsorted, sort_arrays) {
	let ordered = {};
	if (isObject(unsorted)) {
		Object.keys(unsorted).sort(compareStrings).forEach(function (key) {
			ordered[key] = unsorted[key];							// sort all the object's keys
		});
	} else {
		if (sort_arrays === true) {
			try {
				ordered = unsorted.sort(compareStrings);			// sort the array of strings
			} catch (e) {
				ordered = unsorted.sort();							// sort the mixed array
			}
		} else {
			ordered = unsorted;
		}
	}

	for (let i in ordered) {
		if (isObject(ordered[i])) {
			ordered[i] = sortItOut(ordered[i], sort_arrays);		// sort all the object's object's keys
		} else if (Array.isArray(ordered[i])) {
			for (let z in ordered[i]) {
				if (ordered[i][z] && isObject(ordered[i][z])) {
					ordered[i][z] = sortItOut(ordered[i][z], sort_arrays);	// sort the inner object
				}
			}

			if (sort_arrays === true) {
				try {
					ordered[i] = ordered[i].sort(compareStrings);	// sort the array of strings
				} catch (e) {
					ordered[i] = ordered[i].sort();					// sort the array of ?
				}
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

// convert \r\n line endings to \n or vise versa
function line_endings(txt) {
	if (LINE_ENDING === 'unix') {
		return txt.replace(/\r\n/g, '\n');
	}
	if (LINE_ENDING === 'windows') {
		return txt.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n'); // if you convert to unix first we won't aggregate extra \r's
	}
	return txt;
}

// escape the string
function escapeIt(str) {
	return str.replace(/"/g, '\\"');
}

// unescape the string
function unescapeIt(str) {
	return str.replace(/\\"/g, '"');
}

// convert a js object to regular ole json
/*
	{
		things: "stuff",
		"stuff": "things",
		'single': 'single',
		'has space': 'another space',
		'single': "double",
		'plus': "a + sign",
		'dash-in': "name",
		'empty': '',
		a : {
			b: 1,
			c: [0,1,2,3,],
			david: 'this'
		},
	}
*/
function js2json(str) {
	// 1. add double quotes on unquoted object keys
	// 2. replace all object keys & values that have single quotes w/double quotes
	// 3. remove trailing commas in objects (it could be x sequential trailing commas in 1 field or many different fields in the input text)
	// 4. remove trailing commas in arrays (^^ ditto)
	//           .[1]                           .[2]
	let ret = str.replace(/(\w+)\s*:/g, '"$1":').replace(/'([^'"]*)'/g, '"$1"');

	for (let i = 0; i <= 1000; i++) {				// repeat for x number of trailing commas. limit the amount of time we spend here...
		const before = ret.length;

		//       .[3]                                .[4]
		ret = ret.replace(/(\{[\S\s]+),\s*}/g, '$1}').replace(/(\[[\S\s]+),\s*]/g, '$1]');
		if (before === ret.length) { break; }		// once the length stopped changing, we are done
	}
	return ret;
}

// convert a json string to js object w/single quotes
function json2js(str) {
	str = str.replace(/"([^'"]+)"\s*:\s*/g, '$1: ').replace(/"([^'"]*)"/g, '\'$1\'');

	// put quotes around white space and dashes, could be multiple dashes in a key...
	return str.replace(/\s*(.+-.+)\s*:/g, '\n\'$1\':').replace(/(\w+\s+\w+)\s*:/g, '\'$1\':');
}


function decodeAsn1(str) {
	//console.log('str', str);
	// dsh todo parse prev comments and update them instead of removing them....

	let der = Base64.unarmor(str);
	let offset = 0;
	let asn1 = ASN1.decode(der, offset);
	//console.log('asn1 str', asn1.toPrettyString());
	//console.log('asn1 obj', JSON.stringify(asn1.toObj(), null, 2));
	const cert = asn1.toCertObj();
	//console.log('asn1 cert obj!!', JSON.stringify(cert, null, 2));

	return makePemComments(cert) + '\n' + str;
}

// format cert array details into pem comments
function makePemComments(arr) {
	let str = '';
	for (let i in arr) {
		if (arr[i][0] && arr[i][1]) {
			if (typeof arr[i][1] === 'string' && arr[i][1].length <= 256) {		// skip huge hex things, not very helpful to me
				str += `\n# ${arr[i][0]}:`;			// field name
				if (!Array.isArray(arr[i][1])) {
					str += ` ${arr[i][1]}`;			// 1 value
				} else {
					for (let x in arr[i][1]) {
						str += `, ${arr[i][1][x]}`	// many values
					}
				}
			}
		}
	}
	return str;
}

// about:certificate?cert=MIIFOjCCBCKgAwIBAgISBCdVASalHOGJqcxB%2FPyuLfhVMA0GCSqGSIb3DQEBCwUAMDIxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1MZXQncyBFbmNyeXB0MQswCQYDVQQDEwJSMzAeFw0yMTEyMjAxMDUzNDVaFw0yMjAzMjAxMDUzNDRaMB0xGzAZBgNVBAMTEnd3dy5zc2xzaG9wcGVyLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAOeUPEKWMtfvATZk40OwJ%2FFR1YQtvwQhWACVG7Kd7HiGdDDF4cF0qCnd6hSqwAm2c6g%2BfTgsU44uRXwO09s99sk9jCpHrCERA3Ii2OzCaB%2F8nCHzykFdvHbsrzQoyDQRJTjkgnnNl%2FSMyoTQs3iAC60Jctx2W7U%2B2ERP9wB39dw%2Fhn7ULYeNGHuI%2BoFTmEfK%2BFznApHycYks0eN4oe8bMsVsv5vdsOFdi0JlYogPWwROZDws1m4v0Hb00xPUhmKXrjhdV7MZVRFsxR25ZaOWYfFl6sUuiAdEeZbojvKo20qBW9u%2FxGyJWAX8IvCMukpD%2BZTLR9LbHhC%2Fq21bCOCRusECAwEAAaOCAl0wggJZMA4GA1UdDwEB%2FwQEAwIFoDAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwDAYDVR0TAQH%2FBAIwADAdBgNVHQ4EFgQU8%2FYpW7l2tkkMlTObbLmehFSPupYwHwYDVR0jBBgwFoAUFC6zF7dYVsuuUAlA5h%2BvnYsUwsYwVQYIKwYBBQUHAQEESTBHMCEGCCsGAQUFBzABhhVodHRwOi8vcjMuby5sZW5jci5vcmcwIgYIKwYBBQUHMAKGFmh0dHA6Ly9yMy5pLmxlbmNyLm9yZy8wLQYDVR0RBCYwJIIOc3Nsc2hvcHBlci5jb22CEnd3dy5zc2xzaG9wcGVyLmNvbTBMBgNVHSAERTBDMAgGBmeBDAECATA3BgsrBgEEAYLfEwEBATAoMCYGCCsGAQUFBwIBFhpodHRwOi8vY3BzLmxldHNlbmNyeXB0Lm9yZzCCAQQGCisGAQQB1nkCBAIEgfUEgfIA8AB2AG9Tdqwx8DEZ2JkApFEV%2F3cVHBHZAsEAKQaNsgiaN9kTAAABfdewxUcAAAQDAEcwRQIhAPAWpnoO8teE%2FUeWRPOEtjQZzYVJR91Jm5SPgqM4duRtAiAeUDKCyM4ZQiKBbQZdzAHgtYYagcdPIuLV4aRkgksocQB2AEalVet1%2BpEgMLWiiWn0830RLEF0vv1JuIWr8vxw%2Fm1HAAABfdewxU8AAAQDAEcwRQIhAIKKuoeD%2Bd6bPXg3JPeeC%2Bsd3Pass2Vo4ppn6BsoW3L%2FAiAA3V%2B%2Fxe6wUqt9TL2FL%2B6TvYVjFFEQiaFKAlO892tRJzANBgkqhkiG9w0BAQsFAAOCAQEAp%2FFN%2FTlUN3U8%2F6o%2BimqJoWADYNAigaODkmg%2BO4mTQBC%2BlxR3Q33E30d6wjd6CFEyd0QDirZAeTRnCWuXbh9wC0POpBJISQf%2Fmt%2Baa7RXYETnD8TgKuGikcMzGI6iujIxaMz8iUL%2BHKOuH37Y00K1CPAcjrCFxW5xvUtOx3BxdNrO05RIRpmGyK%2BANHIVKh5Ts9AC3elWZE1EceSvnnCEhSJ1uU9mgeCrxP%2FA8n87%2BwcREGq3E5OK7sKTJhl2mhYR0Lozj9npqdQovEzC2JwwjUpBmTFULObr1tETjRzYgLATL5urd4OnYH%2BrzEaRq%2FXzxsm2%2FIB5N2Rm8ageXIpxNA%3D%3D&cert=MIIFFjCCAv6gAwIBAgIRAJErCErPDBinU%2FbWLiWnX1owDQYJKoZIhvcNAQELBQAwTzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2VhcmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMjAwOTA0MDAwMDAwWhcNMjUwOTE1MTYwMDAwWjAyMQswCQYDVQQGEwJVUzEWMBQGA1UEChMNTGV0J3MgRW5jcnlwdDELMAkGA1UEAxMCUjMwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC7AhUozPaglNMPEuyNVZLD%2BILxmaZ6QoinXSaqtSu5xUyxr45r%2BXXIo9cPR5QUVTVXjJ6oojkZ9YI8QqlObvU7wy7bjcCwXPNZOOftz2nwWgsbvsCUJCWH%2BjdxsxPnHKzhm%2B%2Fb5DtFUkWWqcFTzjTIUu61ru2P3mBw4qVUq7ZtDpelQDRrK9O8ZutmNHz6a4uPVymZ%2BDAXXbpyb%2FuBxa3Shlg9F8fnCbvxK%2FeG3MHacV3URuPMrSXBiLxgZ3Vms%2FEY96Jc5lP%2FOoi2R6X%2FExjqmAl3P51T%2Bc8B5fWmcBcUr2Ok%2F5mzk53cU6cG%2FkiFHaFpriV1uxPMUgP17VGhi9sVAgMBAAGjggEIMIIBBDAOBgNVHQ8BAf8EBAMCAYYwHQYDVR0lBBYwFAYIKwYBBQUHAwIGCCsGAQUFBwMBMBIGA1UdEwEB%2FwQIMAYBAf8CAQAwHQYDVR0OBBYEFBQusxe3WFbLrlAJQOYfr52LFMLGMB8GA1UdIwQYMBaAFHm0WeZ7tuXkAXOACIjIGlj26ZtuMDIGCCsGAQUFBwEBBCYwJDAiBggrBgEFBQcwAoYWaHR0cDovL3gxLmkubGVuY3Iub3JnLzAnBgNVHR8EIDAeMBygGqAYhhZodHRwOi8veDEuYy5sZW5jci5vcmcvMCIGA1UdIAQbMBkwCAYGZ4EMAQIBMA0GCysGAQQBgt8TAQEBMA0GCSqGSIb3DQEBCwUAA4ICAQCFyk5HPqP3hUSFvNVneLKYY611TR6WPTNlclQtgaDqw%2B34IL9fzLdwALduO%2FZelN7kIJ%2Bm74uyA%2BeitRY8kc607TkC53wlikfmZW4%2FRvTZ8M6UK%2B5UzhK8jCdLuMGYL6KvzXGRSgi3yLgjewQtCPkIVz6D2QQzCkcheAmCJ8MqyJu5zlzyZMjAvnnAT45tRAxekrsu94sQ4egdRCnbWSDtY7kh%2BBImlJNXoB1lBMEKIq4QDUOXoRgffuDghje1WrG9ML%2BHbisq%2FyFOGwXD9RiX8F6sw6W4avAuvDszue5L3sz85K%2BEC4Y%2FwFVDNvZo4TYXao6Z0f%2BlQKc0t8DQYzk1OXVu8rp2yJMC6alLbBfODALZvYH7n7do1AZls4I9d1P4jnkDrQoxB3UqQ9hVl3LEKQ73xF1OyK5GhDDX8oVfGKF5u%2BdecIsH4YaTw7mP3GFxJSqv3%2B0lUFJoi5Lc5da149p90IdshCExroL1%2B7mryIkXPeFM5TgO9r0rvZaBFOvV2z0gp35Z0%2BL4WPlbuEjN%2FlxPFin%2BHlUjr8gRsI3qfJOQFy%2F9rKIJR0Y%2F8Omwt%2F8oTWgy1mdeHmmjk7j1nYsvC9JSQ6ZvMldlTTKB3zhThV1%2BXWYp6rjd5JW1zbVWEkLNxE7GJThEUG3szgBVGP7pSWTUTsqXnLRbwHOoq7hHwg%3D%3D&cert=MIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAwTzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2VhcmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMTUwNjA0MTEwNDM4WhcNMzUwNjA0MTEwNDM4WjBPMQswCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJuZXQgU2VjdXJpdHkgUmVzZWFyY2ggR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBYMTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAK3oJHP0FDfzm54rVygch77ct984kIxuPOZXoHj3dcKi%2FvVqbvYATyjb3miGbESTtrFj%2FRQSa78f0uoxmyF%2B0TM8ukj13Xnfs7j%2FEvEhmkvBioZxaUpmZmyPfjxwv60pIgbz5MDmgK7iS4%2B3mX6UA5%2FTR5d8mUgjU%2Bg4rk8Kb4Mu0UlXjIB0ttov0DiNewNwIRt18jA8%2Bo%2Bu3dpjq%2BsWT8KOEUt%2Bzwvo%2F7V3LvSye0rgTBIlDHCNAymg4VMk7BPZ7hm%2FELNKjD%2BJo2FR3qyHB5T0Y3HsLuJvW5iB4YlcNHlsdu87kGJ55tukmi8mxdAQ4Q7e2RCOFvu396j3x%2BUCB5iPNgiV5%2BI3lg02dZ77DnKxHZu8A%2FlJBdiB3QW0KtZB6awBdpUKD9jf1b0SHzUvKBds0pjBqAlkd25HN7rOrFleaJ1%2FctaJxQZBKT5ZPt0m9STJEadao0xAH0ahmbWnOlFuhjuefXKnEgV4We0%2BUXgVCwOPjdAvBbI%2Be0ocS3MFEvzG6uBQE3xDk3SzynTnjh8BCNAw1FtxNrQHusEwMFxIt4I7mKZ9YIqioymCzLq9gwQbooMDQaHWBfEbwrbwqHyGO0aoSCqI3Haadr8faqU9GY%2FrOPNk3sgrDQoo%2F%2Ffb4hVC1CLQJ13hef4Y53CIrU7m2Ys6xt0nUW7%2FvGT1M0NPAgMBAAGjQjBAMA4GA1UdDwEB%2FwQEAwIBBjAPBgNVHRMBAf8EBTADAQH%2FMB0GA1UdDgQWBBR5tFnme7bl5AFzgAiIyBpY9umbbjANBgkqhkiG9w0BAQsFAAOCAgEAVR9YqbyyqFDQDLHYGmkgJykIrGF1XIpu%2BILlaS%2FV9lZLubhzEFnTIZd%2B50xx%2B7LSYK05qAvqFyFWhfFQDlnrzuBZ6brJFe%2BGnY%2BEgPbk6ZGQ3BebYhtF8GaV0nxvwuo77x%2FPy9auJ%2FGpsMiu%2FX1%2BmvoiBOv%2F2X%2FqkSsisRcOj%2FKKNFtY2PwByVS5uCbMiogziUwthDyC3%2B6WVwW6LLv3xLfHTjuCvjHIInNzktHCgKQ5ORAzI4JMPJ%2BGslWYHb4phowim57iaztXOoJwTdwJx4nLCgdNbOhdjsnvzqvHu7UrTkXWStAmzOVyyghqpZXjFaH3pO3JLF%2Bl%2B%2F%2BsKAIuvtd7u%2BNxe5AW0wdeRlN8NwdCjNPElpzVmbUq4JUagEiuTDkHzsxHpFKVK7q4%2B63SM1N95R1NbdWhscdCb%2BZAJzVcoyi3B43njTOQ5yOf%2B1CceWxG1bQVs5ZufpsMljq4Ui0%2F1lvh%2BwjChP4kqKOJ2qxq4RgqsahDYVvTH9w7jXbyLeiNdd8XM2w9U%2Ft7y0Ff%2F9yi0GE44Za4rF2LN9d11TPAmRGunUHBcnWEvgJBQl9nJEiU0Zsnvgc%2FubhPgXRR4Xq37Z0j4r7g1SgEEzwxA57demyPxgcYxn%2FeR44%2FKJ4EBs%2BlVDR3veyJm%2BkXQ99b21%2F%2Bjh5Xos1AnX5iItreGCc%3D