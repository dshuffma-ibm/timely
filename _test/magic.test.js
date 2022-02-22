/* global expect, assert*/

console.log('loaded magic test');

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

describe('json magic testing', function () {
	this.timeout(5000);

	// ---------------------------------------------------------------------------------------------------------------------
	describe('json fix', () => {

		//---------------------------------------------------------------------------
		// test fix json magic
		//---------------------------------------------------------------------------
		for (let i in test_cases) {
			it('test' + i, (done) => {
				let DEBUG = (test_cases.length === 1);
				let errors = 0;
				let fixed = fixIt(test_cases[i], 0, test_cases[i].length * 8);
				if (DEBUG) { console.log('final:\n', fixed); }
				try {
					const working = JSON.stringify(JSON.parse(fixed));
					if (DEBUG) { console.log('formatted:\n', JSON.stringify(JSON.parse(fixed), null, 2)); }
					assert.isString(working);
				} catch (e) {
					errors++;
					assert.fail('json fix test failed ' + i);
				}
				done();
			});
		}
	});
});
