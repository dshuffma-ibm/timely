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
let array_extra_comma = '{"hey": ["ab", "one" "two",]}';
let array_extra_comma2 = '{"hey": ["ab", "one", "two",,]}';
let array_extra_comma3 = '{"hey": ["ab", "one", "two",,,,,]}';
let obj_extra_comma = `{
	"hey": {
		"ab": 2,,
		"cd": 3
	},,,,,,,,
}`;
let nested_obj_mixed = `{
	"hey": {
		"boo": [
			{"who": "that"},,
			{"who2": "that2"}
		],
		"hiss": 234
	}
	"hi": 123
}`;
let extra_quote = `{
	"hey": ""there",
	"hi": 123
}`;
let extra_quote2 = `{
	"hey": ""there"
	"hi": 123
}`;
let extra_quote3 = `{
	"hey": "there""
	"hi": 123
}`;
let nested_obj_mixed2 = `{
	"hey": {
		"boo": [
			{"who": "that"}
			{"who2": "that2"}
		]
		"hiss": "234"
		"hello": ["buddy" "pal"]
	}
	"hi": 123
}`;
let single_quotes = `{
	'hey': 'there',
	'hi': 123
}`;
let big_test = `{
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
		david: 'this',
		e: {}
	},
}`;
let smaller_test = `{
	a: {
		b: 1,
		c: [0,1,2,3,],
		david: 'this',
		e: {}
	},
}`;
let line_break_mid_value = `{
	"line": "break-
	here",
	a: ["tes
		ting"]
}`;
let extra_bracket = `{
	"line": "break-
	here",
	a: ["tes
		ting"]
	},
}`;
let empty_str = '{"empty": ""}';
let arr_numbers = '[123]';
let arr_numbers2 = '[123, "test"]';
let arr_numbers3 = '[123, 456, 2]';
let arr_numbers4 = '[123, 456, {"hi : "there"}]';
let DEBUG = true;
let test_cases = [
	missing_comma, nested_obj_missing_comma, nested_obj_missing_comma2, missing_quote, missing_quote2,
	missing_quote3, missing_quote4, missing_bracket, missing_bracket2, missing_bracket3,
	missing_bracket4, js_version, array_missing_comma, array_extra_comma, array_extra_comma2,
	array_extra_comma3, obj_extra_comma, nested_obj_mixed, extra_quote, extra_quote2,
	extra_quote3, nested_obj_mixed2, single_quotes, smaller_test, big_test,
	line_break_mid_value, extra_bracket, empty_str, arr_numbers, arr_numbers2,
	arr_numbers3, arr_numbers4
];
//test_cases = [missing_bracket3];
let results = [];
let pass = true;
for (let i in test_cases) {
	let fixed = fixIt(test_cases[i]);
	console.log('final:\n', fixed);
	try {
		console.log('formatted:\n', JSON.stringify(JSON.parse(fixed), null, 2));
		results.push('success');
	} catch (e) {
		results.push('error');
		pass = false;
	}
}
console.log('\n\n\n');
for (let i in results) {
	console.log((Number(i) + 1), results[i]);
}
console.log(pass ? 'good :)' : 'bad :(');

// fix the JSON - or die in the fire of your own making
function fixIt(str, iter) {
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

	console.log('-----------------');
	let state = lookingForBracket;
	let parsingANumber = false;
	let posLastColon = null;
	let openCurlyBrackets = 0;
	const parsing_history = [];
	let escaped_character = false;
	if (iter === undefined) { iter = 0; }
	else { iter++; }

	// replace(/(\w+)\s*:/g, '"$1":')
	str = str.replace(/""/g, '"').replace(/'([^'"]*)'/g, '"$1"').replace(/[\n\t]/g, '').trim();
	let ret = '';

	if (iter >= 10) {
		console.error('iter limit exceeded, unable to parse');
		return str;
	}

	if (DEBUG) { console.log('\nStart', str); }
	for (let i = 0; i < str.length; i++) {
		let c = str[i];
		ret += c;										// optimistically this character is good to go
		if (c === ' ' || c === '\n' || c === '\t') {
			continue;
		}
		if (c === '\\') {
			escaped_character = true;
			continue;
		}
		prev_char = ret[ret.length - 2];

		const state_str = symbol2str(state);
		const parsing_str = symbol2str(get_parsing());
		if (DEBUG) {
			console.log(iter, '[' + c + '] char:' + (i + 1) + '/' + str.length + ' state:' + state_str + ' parsing:' + parsing_str, openCurlyBrackets);
		}

		// [lookingForBracket]
		if (state === lookingForBracket) {
			if (c === '{' || c === '[') {
				if (c === '[') {
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
				if (DEBUG) { console.log('detected missing quote 1'); }
				ret = ret.substr(0, ret.length - 1) + '"';
				state = lookingForKeyEnd;
				i--;									// repeat
			} else if (c === ']' || c === '}') {
				if (prev_char === '{') {
					state = lookingForKeyStart;
					// was an empty object, all is well
				} else {
					if (DEBUG) { console.log('unexpected bracket, must be extra comma 1'); }
					ret = ret.substr(0, ret.length - 2);
					state = lookingForCommaOrEnd;
					i--;								// repeat
				}
			} else if (c === ',') {
				if (parsingANumber) {
					state = lookingForKeyStart;
				} else {
					if (DEBUG) { console.log('unexpected comma, must be extra comma 2'); }
					parsing_history.pop();
					ret = ret.substr(0, ret.length - 1);
					state = lookingForKeyStart;
				}
			} else if (c === '{') {
				openCurlyBrackets++;
			} else if (isStrictNumber(c)) {				// its a number
				state = lookingForValueEnd;
				parsingANumber = true;
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
			}
		}

		// [lookingForColon]
		else if (state === lookingForColon) {
			if (c === ':') {
				state = lookingForValueStart;
				posLastColon = ret.length - 1;
			}
		}

		// [lookingForValueStart]
		else if (state === lookingForValueStart) {
			if (c === '[') {
				parsing_history.push(ARRAY);
			} else if (c === '{') {
				parsing_history.push(OBJECT);
			}

			if (c === '"') {
				state = lookingForValueEnd;
			} else if (isStrictNumber(c)) {				// its a number
				state = lookingForValueEnd;
				parsingANumber = true;
			} else if (c === '{') {						// its an object
				state = lookingForKeyStart;
				openCurlyBrackets++;
			} else if (isValueCharacter(c) || c === '\'') {
				if (DEBUG) { console.log('detected missing quote 3'); }
				ret = ret.substr(0, ret.length - 1) + '"';
				state = lookingForKeyEnd;
				i--;									// repeat
			} else if (c === ']') {
				if (DEBUG) { console.log('unexpected bracket, must be extra comma 4'); }
				ret = ret.substr(0, ret.length - 2);
				state = lookingForCommaOrEnd;
				i--;									// repeat
			}
		}

		// [lookingForValueEnd]
		else if (state === lookingForValueEnd) {
			if (c === '"' && escaped_character === false) {
				if (prev_char === '"') {
					if (DEBUG) { console.log('detected extra quote 1'); }
					ret = ret.substr(0, ret.length - 1);
					state = lookingForValueEnd;
				} else {
					state = lookingForCommaOrEnd;
				}
			} else if (c === ',') {
				if (parsingANumber) {
					parsingANumber = false;
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
					if (DEBUG) { console.log('detected missing quote 5'); }
					ret = ret.substr(0, ret.length - 1) + '"';
					state = lookingForCommaOrEnd;
					i--;								// repeat
				}
			}
		}

		// [lookingForCommaOrEnd]
		else if (state === lookingForCommaOrEnd) {
			if (c === '"') {
				if (DEBUG) { console.log('detected missing comma 1'); }
				ret = ret.substr(0, ret.length - 1) + ',';
				state = lookingForKeyStart;
				i--;									// repeat
			} else if (c === ',') {
				if (prev_char === ',') {
					if (DEBUG) { console.log('unexpected comma, must be extra comma 3'); }
					ret = ret.substr(0, ret.length - 1);
					state = lookingForKeyStart;
				} else {
					state = lookingForKeyStart;
				}
			} else if (c === '}') {
				openCurlyBrackets--;
				parsing_history.pop();
				if (openCurlyBrackets < 0) {
					if (DEBUG) { console.log('unexpected bracket, must be extra bracket 1'); }
					ret = ret.substr(0, ret.length - 1);
					state = lookingForCommaOrEnd;
				}
				if (i === str.length - 1) {				// if at the end..
					for (; openCurlyBrackets > 0; openCurlyBrackets--) {
						if (DEBUG) { console.log('detected missing bracket 4'); }
						ret += '}';
					}
					if (DEBUG) { console.log('all done 1'); }
					return ret;
				}
			} else if (c === ':') {
				// this fix is a guess... the error is detected way after it happened
				if (DEBUG) { console.log('detected missing bracket in past'); }
				ret = str.substring(0, posLastColon + 1) + '{' + str.substring(posLastColon + 1);
				state = lookingForKeyStart;
				return fixIt(ret, iter);				// repeat...
			} else if (c === ']') {
				parsing_history.pop();
				state = lookingForCommaOrEnd;
			} else if (c === '{') {
				if (get_parsing() === ARRAY) {
					if (DEBUG) { console.log('detected missing comma 3'); }
					ret = ret.substr(0, ret.length - 1) + ',';
					state = lookingForBracket;
					i--;								// repeat
				} else {
					openCurlyBrackets++;
				}
			}
		}

		if (c !== '\\') {
			escaped_character = false;
		}
	}

	if (openCurlyBrackets === 0) {						// if at the end..
		return ret;
	} else {
		if (DEBUG) { console.log('detected missing bracket 3'); }	// this is not the proper exit, if we made it here, missing closing curly bracket
		ret += '}';
		return ret;
	}

	function get_parsing() {
		return parsing_history.length > 0 ? parsing_history[parsing_history.length - 1] : null;
	}
}

function isStrictNumber(char) {
	let numbers = '0123456789';
	return numbers.includes(char);
}

function isValueCharacter(char) {
	let letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+;:?.><=-`~';
	return letters.includes(char);
}

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
