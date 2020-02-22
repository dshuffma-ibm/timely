let missing_comma = `{
	"hey": "there"
	"hi": 123
}`;
let nested_obj_missing_comma = `{
	"hey": {
		"what": "this"
	}
	"hi": 123
}`;
let nested_obj_missing_comma2 = `{
	"hey": {
		"boo": {
			"who": "that"
			"who2": "that2"
		}
	}
	"hi": 123
}`;
let missing_quote = `{
	"hey": there",
	"hi": 123
}`;
let missing_quote2 = `{
	"hey": "there,
	"hi": 123
}`;
let missing_quote3 = `{
	"hey": "there",
	hi": 123
}`;
let missing_quote4 = `{
	"hey": "there",
	"hi: 123
}`;
let missing_bracket = `
	"hey": "there",
	"hi": 123
}`;
let missing_bracket2 = `{
	"hey": "there",
	"hi": 123
`;
let missing_bracket3 = `{
	"hey":
		"there": "that"
	}
}`;
let missing_bracket4 = `{
	"hey":{
		"there": "that"
}`;
let js_version = `{
	hey:{
		there: 'that'
	}
}`;
let array_missing_comma = '{"hey": ["ab", "one" "two"]}';

let DEBUG = true;
let test_cases = [
	missing_comma, nested_obj_missing_comma, nested_obj_missing_comma2, missing_quote, missing_quote2,
	missing_quote3, missing_quote4, missing_bracket, missing_bracket2, missing_bracket3, missing_bracket4,
	js_version, array_missing_comma
];
let results = [];
for (let i in test_cases) {
	console.log('!!', test_cases[i]);
	let fixed = fixIt(test_cases[i]);
	console.log('final:', fixed);
	try {
		JSON.stringify(JSON.parse(fixed), null, 2);
		results.push('success');
	} catch (e) {
		results.push('error');
	}
}
console.log('\n\n\n', results);

// fix the JSON - or die in the fire of your own making
function fixIt(str, iter) {
	/*const lookingForBracket = Symbol('lookingForBracket');
	const lookingForKeyStart = Symbol('lookingForKeyStart');
	const lookingForKeyEnd = Symbol('lookingForKeyEnd');
	const lookingForColon = Symbol('lookingForColon');
	const lookingForValueStart = Symbol('lookingForValueStart');
	const lookingForValueEnd = Symbol('lookingForValueEnd');
	const lookingForCommaOrEnd = Symbol('lookingForCommaOrEnd');*/

	console.log('-----------------');
	let states = [
		'lookingForBracket', 'lookingForKeyStart', 'lookingForKeyEnd',
		'lookingForColon', 'lookingForValueStart', 'lookingForValueEnd',
		'lookingForCommaOrEnd'
	];
	let state = 0;
	let parsingANumber = false;
	let posLastColon = null;
	let openBrackets = 0;
	let parsing = null;
	let escaped_character = false;
	if (iter === undefined) { iter = 0; }
	else { iter++; }

	str = str.replace(/[\n\t]/g, '').trim();
	let ret = '';

	if (iter >= 10) {
		console.error('iter limit exceeded, unable to parse');
		return str;
	}

	if (DEBUG) { console.log('\nStart', str); }
	for (let i = 0; i < str.length; i++) {
		//console.log('loop', i, str);
		let c = str[i];
		ret += c;				// optimistically this character is good to go
		if (c === ' ') {
			continue;
		}
		if (DEBUG) { console.log(iter, '[' + c + '] char:' + (i + 1) + '/' + str.length + ' state:' + states[state] + ' parsing:' + parsing); }

		if (c === '\\') {
			escaped_character = true;
			continue;
		}

		// [lookingForBracket]
		if (states[state] === 'lookingForBracket') {
			if (c === '{' || c === '[') {
				if (c === '[') {
					parsing = 'arr';
				} else {
					parsing = 'obj';
				}
				state++;
				openBrackets++;
			} else {
				if (DEBUG) { console.log('detected missing bracket 1'); }
				ret = ret.substr(0, ret.length - 1) + '{';
				state = 1;			// lookingForKeyStart
				i--;				// repeat
				//let fixedStr = str.substring(0, i) + '{' + str.substring(i);
				//return fixIt(fixedStr, iter);
			}
		}

		// [lookingForKeyStart]
		else if (states[state] === 'lookingForKeyStart') {
			if (c === '"') {			// its a string
				state++;
			} else if (isStrictLetter(c)) {
				if (DEBUG) { console.log('detected missing quote 1'); }
				ret = ret.substr(0, ret.length - 1) + '"';
				state = 2;			// lookingForKeyEnd
				i--;				// repeat
				//let fixedStr = str.substring(0, i) + '"' + str.substring(i);
				//return fixIt(fixedStr, iter);
			}
		}

		// [lookingForKeyEnd]
		else if (states[state] === 'lookingForKeyEnd') {
			if (c === '"') {
				if (parsing === 'arr') {
					state = 6;					// lookingForCommaOrEnd
				} else {
					state++;
				}
			} else if (c === ':') {
				if (DEBUG) { console.log('detected missing quote 2'); }
				ret = ret.substr(0, ret.length - 1) + '"';
				state = 3;			// lookingForColon
				i--;				// repeat
				//let fixedStr = str.substring(0, i) + '"' + str.substring(i);
				//return fixIt(fixedStr, iter);
			} else if (c === '}') {
				if (DEBUG) { console.log('detected missing quote 6'); }
				ret = ret.substr(0, ret.length - 1) + '"';
				state = 6;			// lookingForCommaOrEnd
				i--;				// repeat
			}
		}

		// [lookingForColon]
		else if (states[state] === 'lookingForColon') {
			if (c === ':') {
				state++;
				posLastColon = ret.length - 1;
			}
		}

		// [lookingForValueStart]
		else if (states[state] === 'lookingForValueStart') {
			if (c === '[') {
				parsing = 'arr';
			} else if (c === '{') {
				parsing = 'obj';
			}

			if (c === '"') {
				state++;
			} else if (isStrictNumber(c)) {				// its a number
				state++;
				parsingANumber = true;
			} else if (c === '{') {						// its an object
				state = 1;								// lookingForKeyStart
				openBrackets++;
			} else if (isStrictLetter(c) || c === '\'') {
				if (DEBUG) { console.log('detected missing quote 3'); }
				ret = ret.substr(0, ret.length - 1) + '"';
				state = 2;			// lookingForKeyEnd
				i--;				// repeat
				//let fixedStr = str.substring(0, i) + '"' + str.substring(i);
				//return fixIt(fixedStr, iter);
			}
		}

		// [lookingForValueEnd]
		else if (states[state] === 'lookingForValueEnd') {
			if (c === '"' && escaped_character === false) {
				state++;
			} else if (parsingANumber) {
				if (!isStrictNumber(c)) {				// end of number reached
					state++;
					//i--;
					parsingANumber = false;
					if (states[state] === 'lookingForCommaOrEnd') {
						if (c === '}' || c === ']') {
							if (DEBUG) { console.log('all done 2, success'); }
							return ret;
						}
					}
				}
			} else if (c === ',') {
				if (DEBUG) { console.log('detected missing quote 4'); }
				ret = ret.substr(0, ret.length - 1) + '"';
				state = 3;			// lookingForCommaOrEnd
				i--;				// repeat
				//let fixedStr = str.substring(0, i) + '"' + str.substring(i);
				//return fixIt(fixedStr, iter);
			} else if (c === '}') {
				if (DEBUG) { console.log('detected missing quote 5'); }
				ret = ret.substr(0, ret.length - 1) + '"';
				state = 6;			// lookingForCommaOrEnd
				i--;				// repeat
				//let fixedStr = str.substring(0, i) + '"' + str.substring(i);
				//return fixIt(fixedStr, iter);
			}
		}

		// [lookingForCommaOrEnd]
		else if (states[state] === 'lookingForCommaOrEnd') {
			if (c === '"') {
				if (DEBUG) { console.log('detected missing comma 1'); }
				ret = ret.substr(0, ret.length - 1) + ',';
				state = 1;			// lookingForKeyStart
				i--;				// repeat
				//let fixedStr = str.substring(0, i) + ',' + str.substring(i);
				//return fixIt(fixedStr, iter);
			} else if (c === ',') {
				state = 1;			// lookingForKeyStart
			} else if (c === '}') {
				//console.log('?', i, str.length, '[' + str.substring(i) + ']');
				openBrackets--;
				parsing = null;
				if (i < str.length - 1) {
					if (c === '"') {
						if (DEBUG) { console.log('detected missing comma 2'); }
						let fixedStr = str.substring(0, i) + ',' + str.substring(i);
						return fixIt(fixedStr, iter);
					} else {
						continue;				// its the end of a nested block, not end of string yet
					}
				} else {
					for (; openBrackets > 0; openBrackets--) {
						if (DEBUG) { console.log('detected missing bracket 4'); }
						ret += '}';
					}
					/*if (openBrackets > 0) {
						if (DEBUG) { console.log('detected missing bracket 4'); }
						let fixedStr = str.substring(0, i) + '}' + str.substring(i);
						return fixIt(fixedStr, iter);
					} else {*/
					if (DEBUG) { console.log('all done 1, success'); }
					return ret;
					//}
				}
			} else if (c === ':') {
				// this fix is a guess... the error is detected way after it happened
				if (DEBUG) { console.log('detected missing bracket in past'); }
				ret = str.substring(0, posLastColon + 1) + '{' + str.substring(posLastColon + 1);
				state = 1;			// lookingForKeyStart
				return fixIt(ret, iter);				// repeat...
				//let fixedStr = str.substring(0, posLastColon + 1) + '{' + str.substring(posLastColon + 1);
				//return fixIt(fixedStr, iter);
			} else if (c === ']') {
				parsing = null;
				state = 6;			// lookingForCommaOrEnd
			} else {
				if (DEBUG) { console.log('detected missing bracket 2'); }
				//let fixedStr = str.substring(0, i) + '}' + str.substring(i);
				//return fixIt(fixedStr, iter);
			}
		}

		if (c !== '\\') {
			escaped_character = false;
		}
	}
	if (DEBUG) { console.log('detected missing bracket 3'); }
	ret += '}';
	return ret;
	//let fixedStr = str + '}';
	//return fixIt(fixedStr, iter);
}

function isStrictNumber(char) {
	let numbers = '0123456789';
	for (let i in numbers) {
		if (numbers[i] === char) {
			return true;
		}
	}
	return false;
}

function isStrictLetter(char) {
	let letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	for (let i in letters) {
		if (letters[i] === char) {
			return true;
		}
	}
	return false;
}
