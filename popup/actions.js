/*eslint no-unused-vars: 0*/

// fix json - top level
const fixJson = (str) => {
	const ret = fixIt(str, 0, str.length * 8);
	console.log('json ret', ret);
	return ret;
};

// fix the JSON - or die in the fire of your own making
function fixIt(str, iter, maxIter) {
	let DEBUG = true;
	const lookingForBracket = Symbol('lookingForBracket');
	const lookingForKeyStart = Symbol('lookingForKeyStart');
	const lookingForKeyEnd = Symbol('lookingForKeyEnd');
	const lookingForColon = Symbol('lookingForColon');
	const lookingForValueStart = Symbol('lookingForValueStart');
	const lookingForValueEnd = Symbol('lookingForValueEnd');
	const lookingForCommaOrEnd = Symbol('lookingForCommaOrEnd');
	const ARRAY = Symbol('array');
	const OBJECT = Symbol('object');
	let prev_char = null;
	let next_char = null;
	let state = lookingForBracket;
	let parsingANumber = false;
	let posLastColon = null;
	let strPostLastColon = null;
	let posLastSqrCloseBracket = null;
	let strPosLastSqrCloseBracket = null;
	let posNumberStart = null;
	let strPosNumberStart = null;
	let strPosLastComma = null;
	let posLastComma = null;
	let openCurlyBrackets = 0;
	let openSqrBrackets = 0;
	const parsing_history = [];
	let ret = '';

	if (DEBUG) { console.log('-----------------'); }
	if (typeof str !== 'string') { str = str.toString(); }

	// 1 replace single quote values with double
	// 2 replace single quote keys with double
	// 3 replace 2 curly brackets with 1
	// 4 remove bad sequence of ,"}
	str = str.replace(/:\s*'([^'"]*)'/g, ':"$1"').replace(/'([^'"]*)'\s*:/g, '"$1":');
	str = str.replace(/{{/g, '{').replace(/"([^"]*),"}/g, '"$1"').trim();
	if (DEBUG) { console.log('\nStart max', maxIter, str); }

	// iter on each character in the input
	for (let i = 0; i < str.length; i++) {
		let c = str[i];
		iter++;
		ret += c;											// optimistically this character is good to go
		prev_char = ret.length >= 2 ? ret[ret.length - 2] : null;
		next_char = (str.length > i + 1) ? str[i + 1] : null;
		let skip = false;

		// watch dog
		if (iter > maxIter) {
			console.error('iter limit exceeded, unable to parse', str);
			return str;
		}

		if (DEBUG) {
			const state_str = symbol2str(state);
			const parsing_str = symbol2str(get_parsing());
			console.log(iter, '[' + c + '] char:' + (i + 1) + '/' + str.length + ' state:' + state_str + ' parsing:' + parsing_str,
				openCurlyBrackets + '/' + openSqrBrackets);
		}

		if (c === ' ') { continue; }						// spaces are meaningless, next
		if (c === '\t' || c === '\n' || c === '\r') {		// tabs, newlines, cr are illegal, go figure, remove it
			//if (DEBUG) { console.log('unexpected whitespace', ((c === '\t') ? 'tab' : (c === '\n') ? 'newline' : 'carriage return')); }
			ret = ret.substr(0, ret.length - 1);
			continue;
		}

		// [lookingForBracket]
		if (state === lookingForBracket) {
			if (c === '{' || c === '[') {
				if (c === '[') {
					openSqrBrackets++;
					parsing_history.push(ARRAY);
				} else {
					openCurlyBrackets++;
					parsing_history.push(OBJECT);
				}
				state = lookingForKeyStart;
			} else {
				if (DEBUG) { console.log('detected missing bracket 1'); }
				ret = ret.substr(0, ret.length - 1) + '{';
				state = lookingForKeyStart;
				openCurlyBrackets++;
				i--;									// repeat
			}
		}

		// [lookingForKeyStart]
		else if (state === lookingForKeyStart) {
			if (c === '"') {							// its a string
				state = lookingForKeyEnd;
			} else if (isValueCharacter(c)) {
				if (str.substring(i, i + 4) === 'null') {
					// its just null...
					ret += 'ull';
					i += 3;								// skip to the end of null
					state = lookingForCommaOrEnd;
				} else {
					if (DEBUG) { console.log('detected missing quote 1'); }
					ret = ret.substr(0, ret.length - 1) + '"';
					state = lookingForKeyEnd;
					i--;								// repeat
				}
			} else if (c === ']' || c === '}') {
				if (c === '}' && prev_char === '{') {
					state = lookingForCommaOrEnd;
					openCurlyBrackets--;
					// was an empty object, all is well
				} else {
					if (DEBUG) { console.log('unexpected bracket, must be extra comma 1'); }
					ret = ret.substr(0, ret.length - 2);
					state = lookingForCommaOrEnd;
					i--;								// repeat
				}
			} else if (c === ',') {
				if (parsingANumber) {
					strPosLastComma = i;
					posLastComma = ret.length  - 1;
					state = lookingForKeyStart;
				} else {
					if (DEBUG) { console.log('unexpected comma, must be extra comma 2'); }
					parsing_history.pop();
					ret = ret.substr(0, ret.length - 1);
					state = lookingForKeyStart;
				}
			} else if (c === '{') {
				if (get_parsing() === ARRAY || strPosLastComma === null) {
					parsing_history.push(OBJECT);
					openCurlyBrackets++;
					state = lookingForKeyStart;
				} else {
					if (DEBUG) { console.log('unexpected open bracket, must be missing bracket in past 1'); }
					ret = str.substring(0, strPosLastComma) + '}';	// close it
					openCurlyBrackets--;
					parsing_history.pop();
					state = lookingForCommaOrEnd;
					i = strPosLastComma;					// go back and try again (on the character after that comma)
				}
			} else if (c === '[') {
				parsing_history.push(ARRAY);
				openSqrBrackets++;
				state = lookingForKeyStart;
			} else if (isStrictNumber(c)) {				// its a number
				parsingANumber = true;
				state = lookingForValueEnd;
				posNumberStart = ret.length - 1;
				strPosNumberStart = i;
			}
		}

		// [lookingForKeyEnd]
		else if (state === lookingForKeyEnd) {
			if (c === '"') {
				if (get_parsing() === ARRAY) {
					state = lookingForCommaOrEnd;
				} else {
					state = lookingForColon;
				}
			} else if (c === ':') {
				if (DEBUG) { console.log('detected missing quote 2'); }
				ret = ret.substr(0, ret.length - 1) + '"';
				state = lookingForColon;
				i--;									// repeat
			} else if (c === '}') {
				if (DEBUG) { console.log('detected missing quote 6'); }
				ret = ret.substr(0, ret.length - 1) + '"';
				state = lookingForCommaOrEnd;
				i--;									// repeat
			} else if (c === ']') {
				if (DEBUG) { console.log('detected missing quote 7'); }
				ret = ret.substr(0, ret.length - 1) + '"';
				state = lookingForCommaOrEnd;
				i--;									// repeat
			}
		}

		// [lookingForColon]
		else if (state === lookingForColon) {
			if (c === ':') {
				state = lookingForValueStart;
				posLastColon = ret.length - 1;
				strPostLastColon = i;
			} else {
				if (DEBUG) { console.log('detected missing colon 1'); }
				ret = ret.substr(0, ret.length - 1) + ':';
				state = lookingForValueStart;
				posLastColon = ret.length - 1;
				strPostLastColon = i - 1;
				i--;
			}
		}

		// [lookingForValueStart]
		else if (state === lookingForValueStart) {
			if (c === '"') {
				state = lookingForValueEnd;
			} else if (isStrictNumber(c)) {				// its a number
				state = lookingForValueEnd;
				parsingANumber = true;
				posNumberStart = ret.length - 1;
				strPosNumberStart = i;
			} else if (c === '{') {						// its an object
				parsing_history.push(OBJECT);
				state = lookingForKeyStart;
				openCurlyBrackets++;
			} else if (c === '[') {						// its an array
				parsing_history.push(ARRAY);
				state = lookingForValueStart;
				openSqrBrackets++;
			} else if (c === ']') {
				if (prev_char === '[') {				// it an empty array
					openSqrBrackets--;
					parsing_history.pop();
					state = lookingForCommaOrEnd;
					posLastSqrCloseBracket = ret.length - 1;
					strPosLastSqrCloseBracket = i;
				} else if (prev_char === ',') {
					if (DEBUG) { console.log('unexpected bracket, must be extra comma 4'); }
					ret = ret.substr(0, ret.length - 2);
					state = lookingForCommaOrEnd;
					i--;									// repeat
				} else {
					if (DEBUG) { console.log('unexpected bracket, must be missing bracket in past 2'); }
					ret = ret.substr(0, ret.length - 2) + '[';
					state = lookingForValueStart;
					i--;									// repeat
				}
			} else if (c === '}') {
				if (DEBUG) { console.log('detected missing bracket 4'); }
				ret = ret.substr(0, ret.length - 1) + '{';
				openCurlyBrackets++;
				state = lookingForCommaOrEnd;
			} else if (c === ':') {
				if (DEBUG) { console.log('detected extra colon 1'); }
				ret = ret.substr(0, ret.length - 1);
				state = lookingForValueStart;
			} else if (c === ',') {
				if (DEBUG) { console.log('detected missing quotes 1'); }
				ret = ret.substr(0, ret.length - 1) + '""';
				state = lookingForCommaOrEnd;
			} else if (isValueCharacter(c)) {
				if (str.substring(i, i + 4) === 'null') {
					// its just null...
					ret += 'ull';						// skip to the end of null
					i += 3;
					state = lookingForCommaOrEnd;
				} else {
					if (DEBUG) { console.log('detected missing quote 3'); }
					ret = ret.substr(0, ret.length - 1) + '"';
					state = lookingForValueEnd;
					i--;								// repeat
				}
			}
		}

		// [lookingForValueEnd]
		else if (state === lookingForValueEnd) {
			skip = false;
			if (c === '"') {
				if (parsingANumber) {
					if (DEBUG) { console.log('detected missing comma 4'); }
					ret = ret.substr(0, ret.length - 1) + ',';
					state = lookingForKeyStart;
					i--;								// repeat
				} else {
					state = lookingForCommaOrEnd;
				}
			} else if (c === ',') {
				if (parsingANumber) {
					parsingANumber = false;
					strPosLastComma = i;
					posLastComma = ret.length  - 1;
					if (get_parsing() === ARRAY) {
						state = lookingForValueStart;
					} else {
						state = lookingForKeyStart;
					}
				} else {
					if (DEBUG) { console.log('detected missing quote 4'); }
					ret = ret.substr(0, ret.length - 1) + '"';
					state = lookingForCommaOrEnd;
					i--;								// repeat
				}
			} else if (c === '}') {
				if (parsingANumber) {
					parsingANumber = false;
					state = lookingForCommaOrEnd;
					ret = ret.substr(0, ret.length - 1);
					i--;								// repeat, to detect the end of object
				} else {
					if (DEBUG) { console.log('detected missing quote 8'); }
					ret = ret.substr(0, ret.length - 1) + '"';
					state = lookingForCommaOrEnd;
					i--;								// repeat
				}
			} else if (c === ']') {
				if (parsingANumber) {					// if parsing a string, brackets could be simple character in string
					openSqrBrackets--;
					parsing_history.pop();
					state = lookingForCommaOrEnd;
					posLastSqrCloseBracket = ret.length - 1;
					strPosLastSqrCloseBracket = i;
				} else {
					if (DEBUG) { console.log('detected missing quote 9'); }
					ret = ret.substr(0, ret.length - 1) + '"';
					state = lookingForCommaOrEnd;
					i--;								// repeat
				}
			} /*  removed - could be a normal colon character in string
			else if (c === ':') {
				if (DEBUG) { console.log('detected extra colon 2'); }
				ret = ret.substr(0, ret.length - 1);
				state = lookingForValueEnd;
				skip = true;
			} */else if (parsingANumber && !isStrictNumber(c)) {		// its aaa was a number
				if (c === ':') {
					if (DEBUG) { console.log('detected extra colon 3'); }
					ret = ret.substr(0, ret.length - 1);
					state = lookingForValueEnd;
					skip = true;
				} else {
					if (DEBUG) { console.log('detected missing quotes on string in past'); }
					parsingANumber = false;
					ret = str.substring(0, strPosNumberStart) + '"';
					state = lookingForValueEnd;
					i = strPosNumberStart - 1;							// repeat, start over at the quote
				}
			}

			if (!isStrictNumber(c)) {								// if we find even 1 non-number we are not parsing a number
				if (skip === false) {		// if we are going back (to remove this char), then don't count this c towards this state
					parsingANumber = false;
				}
			}
		}

		// [lookingForCommaOrEnd]
		else if (state === lookingForCommaOrEnd) {
			if (c === '"') {
				if (next_char === '\n' || next_char === '\r' || next_char === ',' || next_char === '}' || next_char === null) { // seems sketchy...
					if (DEBUG) { console.log('detected extra quote 2'); }
					ret = ret.substr(0, ret.length - 1);
					state = lookingForCommaOrEnd;
				} else {
					if (DEBUG) { console.log('detected missing comma 1'); }
					ret = ret.substr(0, ret.length - 1) + ',';
					state = lookingForKeyStart;
					i--;									// repeat
				}
			} else if (c === ',') {
				if (prev_char === ',') {
					if (DEBUG) { console.log('unexpected comma, must be extra comma 3'); }
					ret = ret.substr(0, ret.length - 1);
					state = lookingForKeyStart;
				} else {
					strPosLastComma = i;
					posLastComma = ret.length  - 1;
					if (get_parsing() === ARRAY) {
						state = lookingForValueStart;
					} else {
						state = lookingForKeyStart;
					}
				}
			} else if (c === '}') {
				openCurlyBrackets--;
				parsing_history.pop();
				if (openCurlyBrackets < 0) {
					if (DEBUG) { console.log('unexpected bracket, must be extra bracket 1'); }
					ret = ret.substr(0, ret.length - 1);
					state = lookingForCommaOrEnd;
					openCurlyBrackets = 0;
				}
				if (i === str.length - 1) {				// if at the end...
					balance_brackets();
					if (DEBUG) { console.log('all done 1', openCurlyBrackets + '/' + openSqrBrackets); }
					return ret;
				}
			} else if (c === ':') {
				if (DEBUG) { console.log('detected missing bracket in past'); }
				if (get_parsing() === OBJECT) {
					ret = ret.substring(0, posLastColon + 1) + '{';			// i know this state b/c {{ is impossible
					state = lookingForKeyStart;
					i = strPostLastColon;
					openCurlyBrackets++;
				} else {
					ret = ret.substring(0, posLastComma) + ']' + str.substring(strPosLastComma);
					return fixIt(ret, iter, maxIter);				// I don't know what state we were in at this position, so repeat...
				}
			} else if (c === ']') {
				openSqrBrackets--;
				parsing_history.pop();
				posLastSqrCloseBracket = ret.length - 1;
				strPosLastSqrCloseBracket - i;
				if (openSqrBrackets < 0) {
					if (DEBUG) { console.log('unexpected bracket, must be extra bracket 2'); }
					ret = ret.substr(0, ret.length - 1);
					state = lookingForCommaOrEnd;
					openSqrBrackets = 0;
				}
				if (i === str.length - 1) {				// if at the end..
					balance_brackets();
					if (DEBUG) { console.log('all done 2', openCurlyBrackets + '/' + openSqrBrackets); }
					return ret;
				}
			} else if (c === '{') {
				if (get_parsing() === ARRAY) {
					if (DEBUG) { console.log('detected missing comma 3'); }
					ret = ret.substr(0, ret.length - 1) + ',';
					state = lookingForBracket;
					i--;								// repeat
				} else {
					openCurlyBrackets++;
				}
			} else if (isValueCharacter(c) && next_char !== ',') {	// this will miss the case where empty string is the last element, like: {"test": ""}
				if (DEBUG) { console.log('detected extra quote 1'); }
				ret = ret.substr(0, ret.length - 2);
				state = lookingForValueEnd;
				i--;									// repeat
			}
		}
	}

	// ----- ending soon ----- //
	if (state === lookingForKeyEnd) {
		if (DEBUG) { console.log('detected missing quote 10'); }
		ret += '": ""';
	}
	if (state === lookingForValueEnd) {					// this is a theoretical/made up state, feel free to remove it
		if (parsingANumber === false) {
			if (DEBUG) { console.log('detected missing quote 11'); }
			ret += '"';
		}
	}
	balance_brackets();									// this is not the proper exit, if we made it here, missing closing curly bracket
	if (DEBUG) { console.log('unexpected done 3', openCurlyBrackets + '/' + openSqrBrackets, state); }
	return ret;

	function balance_brackets() {
		for (; openSqrBrackets > 0; openSqrBrackets--) {
			if (DEBUG) { console.log('detected missing bracket 2'); }
			ret += ']';
		}
		for (; openCurlyBrackets > 0; openCurlyBrackets--) {
			if (DEBUG) { console.log('detected missing bracket 3'); }
			ret += '}';
		}
	}

	// return the current parsing symbol
	function get_parsing() {
		return parsing_history.length > 0 ? parsing_history[parsing_history.length - 1] : null;
	}

	// detect a valid numeric character
	function isStrictNumber(char) {
		let numbers = '0123456789';
		return numbers.includes(char);
	}

	// detect a valid character for a key's value
	function isValueCharacter(char) {
		let invalid_characters = '[]{}":,';
		return !invalid_characters.includes(char);
	}

	// return string from symbol's name
	function symbol2str(sym) {
		if (sym) {
			let sym_str = sym.toString();
			sym_str = sym_str.substr(7);
			sym_str = sym_str.substring(0, sym_str.length - 1);
			return sym_str;
		} else {
			return null;
		}
	}
}

// ------------------------------------------------------
// pretty print diff of two strings
// ------------------------------------------------------

// pretty print json
function breakMeDown(orig_str, fixed_str) {
	let ret = '';
	const orig_lines = break_items(orig_str.replace(/[\t\n\r]/g, '').replace(/\s*([^"])/g, '$1').replace(/[{]\s+"/g, '{"'));
	const fixed_lines = break_items(fixed_str.replace(/[\t\n\r]/g, '').replace(/\s*([^"])/g, '$1').replace(/[{]\s+"/g, '{"'));
	console.log(orig_lines);
	console.log(fixed_lines);

	let x = 0;
	for (let i = 0; i < orig_lines.length; i++) {
		if (orig_lines[x]) { orig_lines[i] = orig_lines[i].trim(); }
		if (fixed_lines[x]) { fixed_lines[x] = fixed_lines[x].trim(); }
		//if (orig_lines[i] === fixed_lines[x]) {
		if (orig_lines[i].replace(/:\s+/g, ':') === fixed_lines[x].replace(/:\s+/g, ':')) {		// ignore space differences
			ret += '<sss>🗸 ' + orig_lines[i] + '</sss>\n';
		} else {
			const del = findDeletions(orig_lines[i], fixed_lines[x]);
			const add = findAdditions(orig_lines[i], fixed_lines[x]);
			const total = del.differences + add.differences;

			let total2 = null;
			let del2, add2;
			if (fixed_lines[Number(x) + 1]) {	// check if the next line is actually better
				del2 = findDeletions(orig_lines[i], fixed_lines[Number(x) + 1]);
				add2 = findAdditions(orig_lines[i], fixed_lines[Number(x) + 1]);
				total2 = del2.differences + add2.differences;
			}

			if (total2 !== null && total2 < total) {
				console.log('the next line is a better match');
				ret += '<edl>+ <dif>' + add.str + '</dif></edl>\n';
				ret += '\n';
				ret += '<ogl>- ' + del2.str + '</ogl>\n';
				ret += '<edl>+ ' + add2.str + '</edl>\n';
				x++;
			} else {
				ret += '<ogl>- ' + del.str + '</ogl>\n';
				if (add.str) { ret += '<edl>+ ' + add.str + '</edl>\n'; }
			}
		}
		ret += '\n';
		x++;
	}
	return ret;
}

function break_after(str) {
	const LEN = 90;						// really old way
	const ret = [];
	for (let i = 0; i < str.length - 1;) {
		ret.push(str.substring(i, i + LEN));
		i += LEN;
	}
}

function break_items(str) {
	/*const ret = str.split('",');		// old way
	for (let i in ret) {
		ret[i] = ret[i] += '",';
	}*/

	const ret = [];
	let iter = 0;
	while (iter <= 1000) {
		iter++;
		const pos = indexOfThings(str);
		if (pos >= 0) {
			const before = str.substring(0, pos);
			const after = str.substring(pos);
			ret.push(before);
			str = after;
		} else {
			ret.push(str);
			break;
		}
	}
	return ret;

	function indexOfThings(str) {
		const split_on = ['",', 'false,', 'true,', 'null,', '},', '],'];
		let ret = -1;
		for (let i in split_on) {
			const thing = split_on[i];
			let pos = str.indexOf(thing);
			if (pos >= 0) {
				pos += thing.length
				if (ret === -1 || (pos < ret)) {
					ret = pos;
				}
			}
		}
		return ret;
	}
}

function findAdditions(orig_line, fixed_line) {
	console.log('findAdditions ol', orig_line);
	console.log('findAdditions fl', fixed_line);
	let differences = 0;
	let ret = '';
	let x = 0;
	let detectedDiff = false;
	orig_line = orig_line ? orig_line : '';
	fixed_line = fixed_line ? fixed_line : '';

	for (let i = 0; i < fixed_line.length; i++) {
		console.log(i, x, fixed_line[i], orig_line[x], ret, detectedDiff);

		if (fixed_line[i] === orig_line[x]) {
			if (detectedDiff === true) {
				detectedDiff = false;
				ret += '</dif>';
			}
			ret += fixed_line[i];
		} else if (fixed_line[i] === ' ') {		// skip the highlighting of space differences (this will hide space differences that matter, like in values or keys)
			x--;								// should be okay b/c json fixer should not be injecting spaces in keys or values to make such a differences
			ret += fixed_line[i];
		} else {
			differences++;

			if (orig_line[i + 1] === fixed_line[x + 1]) {
				// if the next character in orig matches the next character in fixed.. than this char was replaced (back on track)
				// probably at least
				if (detectedDiff === false) {
					detectedDiff = true;
					ret += '<dif>';
				}
				ret += fixed_line[i];
			} else if (fixed_line[i + 1] === orig_line[x]) {
				// if the next character in fixed does match this orig character, than this char was added (back on track)
				// probably at least
				if (detectedDiff === false) {
					detectedDiff = true;
					ret += '<dif>';
				}
				ret += fixed_line[i];
				x--;								// repeat char in original
			} else if (fixed_line[i] === orig_line[x + 1]) {
				// if the next character in orig matches this fixed character, than this char was deleted (back on track)
				// probably at least
				if (fixed_line[i]) { ret += fixed_line[i]; }
				x++;								// skip deleted char
			} else {
				if (detectedDiff === false) {
					detectedDiff = true;
					ret += '<dif>';
				}
				ret += fixed_line[i];
				x--;								// repeat char in original
			}
		}
		x++;
	}
	if (detectedDiff === true) {
		detectedDiff = false;
		ret += '</dif>';							// close tag
	}
	return { str: ret, differences: differences };
}

function findDeletions(orig_line, fixed_line) {
	console.log('findDeletions ol', orig_line);
	console.log('findDeletions fl', fixed_line);
	let differences = 0;
	let ret = '';
	let x = 0;
	let detectedDiff = false;
	orig_line = orig_line ? orig_line : '';
	fixed_line = fixed_line ? fixed_line : '';

	for (let i = 0; i < orig_line.length; i++) {
		console.log(i, x, orig_line[i], fixed_line[x], ret, detectedDiff);

		if (orig_line[i] === fixed_line[x]) {
			if (detectedDiff === true) {
				detectedDiff = false;
				ret += '</dif>';
			}
			ret += orig_line[i];
		} else if (orig_line[i] === ' ') {			// skip the highlighting of space differences (this will hide space differences that matter, like in values or keys)
			x--;
			ret += orig_line[i];
		} else {
			differences++;

			if (fixed_line[x] === undefined) {		// the character dne in fixed, it was deleted
				if (detectedDiff === false) {
					detectedDiff = true;
					ret += '<dif>';
				}
			}

			if (orig_line[i + 1] === fixed_line[x + 1]) {
				// if the next character in orig matches the next character in fixed.. than this char was replaced (back on track)
				// probably at least
				if (detectedDiff === false) {
					detectedDiff = true;
					ret += '<dif>';
				}
				ret += orig_line[i];
			} else if (orig_line[i] === fixed_line[x + 1]) {
				// if the next character in fixed does match this orig character, than this char was added (back on track)
				// probably at least
				if (orig_line[i]) { ret += orig_line[i]; }
				x++;								// skip added char
			} else if (orig_line[i + 1] === fixed_line[x]) {
				// if the next character in orig matches this fixed character, than this char was deleted (back on track)
				// probably at least
				if (detectedDiff === false) {
					detectedDiff = true;
					ret += '<dif>';
				}
				ret += orig_line[i];
				x--;								// repeat char in fixed
			} else {
				if (orig_line[i]) { ret += orig_line[i]; }
				x++;								// skip added char
			}
		}
		x++;
	}
	if (detectedDiff === true) {
		detectedDiff = false;
		ret += '</dif>';							// close tag
	}
	return { str: ret, differences: differences };
}