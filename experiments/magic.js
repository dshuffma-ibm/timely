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
let extra_quote4 = '{"hey": "there","}';
let extra_quote5 = '{"hey": "there,"}';
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
	"line": "break-\t\nhere",
	"escaped": "tab\\tstuff",
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
let extra_bracket1 = '{{"hey": "there", "hi": 123}';
let extra_bracket2 = '{"hey": "there", "hi": 123}}';
let extra_bracket3 = '[[123]';
let extra_bracket4 = '[123]]';
let extra_bracket5 = '[[[[[123]]';
let extra_bracket6 = '{"asd": [[[123], "ad": "test"}';
let extra_bracket7 = '{"h":}"i"}';
let extra_bracket8 = `{"asd": [[[123			  		
         
		]					
									, "ad": "test"}`;
let extra_colon1 = '{asd::"test"}';
let extra_colon2 = `{
	a: {
		b: 1,
		c: [0,1,2,3,],
		david:: 'this',
		e: {}
	},
}`;
let extra_colon3 = `{
	"a": {
		"b": 1:,
		"david": 'this',
		"e": {}
	},
}`;
let missing_quotes1 = `{
	"a": {
		d:,
		"asd": '123',
		"e": {}
	},
}`;
let missing_quotes2 = `{
	"a": {d:,"asd": '123',"e": {}},
}`;
let escape_char1 = '{"hey": "hey \'kid\'"}';
let single_quotes2 = '{\'hey\': \'hey\'}';
let escape_char2 = '{"hey": "hey kid\'s"}';
let duration1 = '{"hey": 10s}';
let duration2 = `{
	"a": {"david":   10h3,},
}`;
let deep = `{
	"last_update": {
		"payload": {
			"data": {
				"write_set": {
					"groups": {
						"Orderer": {
							"groups": {},
							"mod_policy": "",
							"policies": {},
							"values": {},
							"version": "0"
						}
					},
					"mod_policy": "",
					"policies": {},
					"values": {},
					"version": "0"
				}
			}
		}
	}
}`;

// valid
let huge = `{
	"config": {
		"channel_group": {
			"groups": {
				"Consortiums": {
					"groups": {
						"SampleConsortium": {
							"groups": {
								"PeerOrg1": {
									"groups": {},
									"mod_policy": "Admins",
									"policies": {
										"Admins": {
											"mod_policy": "Admins",
											"policy": {
												"type": 1,
												"value": {
													"identities": [{
														"principal": {
															"msp_identifier": "PeerOrg1",
															"role": "ADMIN"
														},
														"principal_classification": "ROLE"
													}],
													"rule": {
														"n_out_of": {
															"n": 1,
															"rules": [{
																"signed_by": 0
															}]
														}
													},
													"version": 0
												}
											},
											"version": "0"
										},
										"Readers": {
											"mod_policy": "Admins",
											"policy": {
												"type": 1,
												"value": {
													"identities": [{
														"principal": {
															"msp_identifier": "PeerOrg1",
															"role": "MEMBER"
														},
														"principal_classification": "ROLE"
													}],
													"rule": {
														"n_out_of": {
															"n": 1,
															"rules": [{
																"signed_by": 0
															}]
														}
													},
													"version": 0
												}
											},
											"version": "0"
										},
										"Writers": {
											"mod_policy": "Admins",
											"policy": {
												"type": 1,
												"value": {
													"identities": [{
														"principal": {
															"msp_identifier": "PeerOrg1",
															"role": "MEMBER"
														},
														"principal_classification": "ROLE"
													}],
													"rule": {
														"n_out_of": {
															"n": 1,
															"rules": [{
																"signed_by": 0
															}]
														}
													},
													"version": 0
												}
											},
											"version": "0"
										}
									},
									"values": {
										"MSP": {
											"mod_policy": "Admins",
											"value": {
												"config": {
													"admins": [
														"sadf"
													],
													"crypto_config": null,
													"fabric_node_ous": null,
													"intermediate_certs": [
														"asdf=",
														"sfsaf="
													],
													"name": "PeerOrg1",
													"organizational_unit_identifiers": [],
													"revocation_list": [],
													"root_certs": [
														"asdf="
													],
													"signing_identity": null,
													"tls_intermediate_certs": [
														"adsf",
														"asdf"
													],
													"tls_root_certs": [
														"dfs"
													]
												},
												"type": 0
											}
										}
									}
								}
							},
							"mod_policy": "/Channel/Orderer/Admins",
							"policies": {},
							"values": {
								"ChannelCreationPolicy": {
									"mod_policy": "/Channel/Orderer/Admins",
									"value": {
										"type": 3,
										"value": {
											"rule": "ANY",
											"sub_policy": "Admins"
										}
									},
									"version": "0"
								}
							}
						}
					},
					"mod_policy": "/Channel/Orderer/Admins",
					"policies": {
						"Admins": {
							"mod_policy": "/Channel/Orderer/Admins",
							"policy": {
								"type": 1,
								"value": {
									"identities": [],
									"rule": {
										"n_out_of": {
											"n": 0,
											"rules": []
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
}`;
let null_test1 = '{"test": null, "arr": ["t", null, 5]}';
let missing_colon = '{"test": null, "arr" ["t", 5]}';
let extra_colon4 = '{"test": null, "arr" ["t", :5]}';
let missing_bracket5 = `{
	"hey": {
		"boo": [
			{"who": "that"
			,{"who2": "that2"}
		]
	}
}`;
let missing_quote5 = '["a", b]';
let missing_colon2 = '["a", {h""i"}]';
let missing_bracket7 = '"h":"i"}';
let extra_comma4 = '"h":"i",}';
let valid_with_brackets = '{"h":"[i]"}';
let valid_with_brackets2 = '{"h":"{i}"}';
let valid_with_colon = '{"h":"{:}"}';
let missing_bracket8 = '{"config": }}';
let extra_quote6 = '{"hey": "there"","hi": 123}';
let extra_quote7 = '{"hey": "there""}';

// valid
let smaller = `{
	"values": {
		"MSP": {
			"mod_policy": "Admins",
			"value": {
				"config": {
					"admins": [
						"sadf"
					],
					"crypto_config": null,
					"fabric_node_ous": null,
					"intermediate_certs": [
						"asdf=",
						"sfsaf="
					],
					"name": "PeerOrg1",
					"organizational_unit_identifiers": [],
					"revocation_list": [],
					"root_certs": [
						"asdf="
					],
					"signing_identity": null,
					"tls_intermediate_certs": [
						"adsf",
						"asdf"
					],
					"tls_root_certs": [
						"dfs"
					]
				},
				"type": 0
			}
		}
	}
}`;

// valid
let smaller2 = `{			
	"mod_policy": "/Channel/Orderer/Admins",
	"policies": {
		"Admins": {
			"mod_policy": "/Channel/Orderer/Admins",
			"policy": {
				"type": 1,
				"value": {
					"identities": [],
					"rule": {
						"n_out_of": {
							"n": 0,
							"rules": []
						}
					}
				}
			}
		}
	}
}`;
// valid
let emptyObj = `{"test": { "empty" : {}, "stuff": "abc", "empty2": {} }}`;

let missing_comma2 = `{			
	"mod_policy": "/Channel/Orderer/Admins",
	"policies": {
		"Admins": {
			"mod_policy": "/Channel/Orderer/Admins",
			"policy": {
				"type": 1
				"value": {
					"identities": [],
					"rule": {
						"n_out_of": {
							"n": 0,
							"rules": []
						}
					}
				}
			}
		}
	}
}`;

let missing_bracket9 = `{			
	"mod_policy": "/Channel/Orderer/Admins",
	"policies": {
		"Admins": {
			"mod_policy": "/Channel/Orderer/Admins",
			"policy": 
				"type": 1,
				"value": {
					"identities": [],
					"rule": {
						"n_out_of": {
							"n": 0,
							"rules": []
						}
					}
				}
			}
		}
	}
}`;
let missing_bracket10 = `{
	"value": {
		"identities": 
		]
	}
}`;
let dumb = 'hello there';
let dumber = 1234;
let missing_bracket11 = `{
	"key": [
		"item"
	,
	"another": 40
}`;

// -------------------------------------------------------------------------------------------------------------------------
let test_cases = [
	missing_comma, nested_obj_missing_comma, nested_obj_missing_comma2, missing_quote, missing_quote2, 	// 5
	missing_quote3, missing_quote4, missing_bracket, missing_bracket2, missing_bracket3,				// 10
	missing_bracket4, js_version, array_missing_comma, array_extra_comma, array_extra_comma2,			// 15
	array_extra_comma3, obj_extra_comma, nested_obj_mixed, extra_quote, extra_quote2,					// 20
	extra_quote3, nested_obj_mixed2, single_quotes, smaller_test, big_test,								// 25
	line_break_mid_value, extra_bracket, empty_str, arr_numbers, arr_numbers2,							// 30
	arr_numbers3, arr_numbers4, extra_bracket1, extra_bracket2, extra_bracket3,							// 35
	extra_bracket4, extra_bracket5, extra_bracket6, extra_colon1, extra_colon2,							// 40
	extra_colon3, missing_quotes1, missing_quotes2, extra_quote4, extra_quote5,							// 45
	escape_char1, single_quotes2, escape_char2, duration1, duration2,									// 50
	deep, emptyObj, null_test1, missing_colon, extra_colon4,											// 55
	missing_bracket5, missing_quote5, missing_colon2, missing_bracket7, extra_comma4,					// 60
	valid_with_brackets, valid_with_brackets2, valid_with_colon, missing_bracket8, extra_quote6,		// 65
	extra_quote7, missing_comma2, extra_bracket8, huge, smaller, 										// 70
	smaller2, dumb, dumber
];
//test_cases = [missing_bracket11];
let DEBUG = test_cases.length === 1;
let results = [];
let pass = true;
let errors = 0;
let onTest = 0;
for (let i in test_cases) {
	onTest = i;
	let fixed = fixIt(test_cases[i], 0, test_cases[i].length * 8);
	if (DEBUG) { console.log('final:\n', fixed); }
	try {
		const working = JSON.stringify(JSON.parse(fixed));
		if (DEBUG) { console.log('formatted:\n', JSON.stringify(JSON.parse(fixed), null, 2)); }
		results.push('success');
	} catch (e) {
		results.push('error');
		pass = false;
		errors++;
	}
}
console.log('\n');
for (let i in results) {
	console.log((Number(i) + 1), results[i]);
}
console.log('errors:', errors);
console.log(pass ? 'good :)' : 'bad :(');

// -------------------------------------------------------------------------------------------------------------------------

// fix the JSON - or die in the fire of your own making
function fixIt(str, iter, maxIter) {
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
