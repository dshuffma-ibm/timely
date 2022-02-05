/* global browser, use_offset*/
/*eslint no-unused-vars: 0*/
let FORMAT = '%q %d, %Y %I:%m%p';			// default
let ADD_SPACE_HEX = true;					// default
let EXPIRATION = 1000 * 60 * 5;				// default
let LINE_ENDING = 'unix';					// default

// local storage keys
const LS_KEY_DATE = 'dateFormat';
const LS_KEY_FORGET = 'forget';
const LS_KEY_HEX = 'hexSpace';
const LS_KEY_TEXT = 'textInput';
const LS_KEY_TIME = 'timeInput';
const LS_KEY_OPEN = 'autoOpen';
const LS_KEY_ENDINGS = 'lineEndings';

// save something to the local storage
function saveThing(item, value, expires) {
	try {
		if (browser) {
			const obj = {};
			const data = {
				value: value,
			};
			if (expires === true) {
				data.expires = Date.now() + EXPIRATION;
			}
			obj[item] = JSON.stringify(data);
			browser.storage.sync.set(obj);
			console.log('[settings] saved setting', item, obj);
		}
	} catch (e) {
		console.error('[settings] could not save item', item, e);
	}
}

// get a local storage item
function getThing(item, cb) {
	if (browser) {
		browser.storage.sync.get(item).then(function (storage) {
			if (!storage || storage[item] === undefined) {
				console.error('1 - item dne', item);
				cb(null);
			} else {
				let data = null;
				try {
					data = JSON.parse(storage[item]);
				} catch (e) {
					console.error('cannot parse item', item, storage[item]);
				}
				if (!data) {
					console.error('2 - item dne', item);
					cb(null);
				} else if (!data.expires) {
					//console.log('1 - got item', item, storage[item]);
					cb(data.value);
				} else {
					const time_left = data.expires - Date.now();
					if (isNaN(data.expires) || time_left <= 0) {
						//console.log('its expired', item);
						cb(null);
					} else {
						//console.log('2 - got item', item, storage[item]);
						cb(data.value);
					}
				}
			}
		});
	}
}

// update the example text box
function updateExample() {
	let theFormat = document.getElementById('dateFormat').value;
	if (theFormat) {
		document.getElementById('exampleDate').innerText = formatDate(Date.now(), theFormat);
	}
}

//------------------------------------------------------------
// format a date from timestamp
//------------------------------------------------------------
function formatDate(timestamp_ms, fmt) {
	let d = new Date();
	let offset_ms = d.getTimezoneOffset() * 60 * 1000;
	let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	let monthFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	try {
		if (!use_offset) {
			offset_ms = 0;
		}
	} catch (e) { }

	function pad(value) {
		return (value.toString().length < 2) ? '0' + value : value;
	}

	if (!timestamp_ms || isNaN(timestamp_ms)) {
		return null;
	} else {
		let date = new Date(timestamp_ms - offset_ms);
		if (isNaN(date.getTime())) {
			return null;
		}
		return fmt.replace(/%([a-zA-Z])/g, function (_, fmtCode) {
			let tmp;
			switch (fmtCode) {
				case 'Y':								//Year
					return date.getUTCFullYear();
				case 'M':								//Month 0 padded
					return pad(date.getUTCMonth() + 1);
				case 'n':								//Month
					return date.getUTCMonth() + 1;
				case 'q':								//Month name, 'Oct'
					return months[date.getUTCMonth()];
				case 'Q':								//Month name, 'October'
					return monthFull[date.getUTCMonth()];
				case 'd':								//Date 0 padded
					return pad(date.getUTCDate());
				case 'D':								//Date
					return date.getUTCDate();
				case 'H':								//24 Hour 0 padded
					return pad(date.getUTCHours());
				case 'I':								//12 Hour 0 padded
					tmp = date.getUTCHours();
					if (tmp === 0) { tmp = 12; }		//00:00 should be seen as 12:00am
					else if (tmp > 12) { tmp -= 12; }
					return pad(tmp);
				case 'p':								//am / pm
					tmp = date.getUTCHours();
					if (tmp >= 12) { return 'pm'; }
					return 'am';
				case 'P':								//AM / PM
					tmp = date.getUTCHours();
					if (tmp >= 12) { return 'PM'; }
					return 'AM';
				case 'm':								//Minutes 0 padded
					return pad(date.getUTCMinutes());
				case 's':								//Seconds 0 padded
					return pad(date.getUTCSeconds());
				case 'r':								//Milliseconds 0 padded
					return pad(date.getUTCMilliseconds(), 3);
				case 'z':								//UTC timestamp
					return date.getTime();
				default:
					console.warn('unsupported fmt for format date()', fmt);
					return date.getTime();
			}
		});
	}
}
