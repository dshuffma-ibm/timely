
//const textInput1 = '{hey": "\'there",\n "test":"me", \n"a":["same"], \n"abc"test" \n "d": "e",\n "abc":"def"}';
//const textInput2 = '{"hey": "there", \n"test":"me", \n"a":["same"], \n"abc":"tet" \n "d": "e",\n "ghi": "jkl"}';

//const textInput1 = '{hey": "\'there",\n "test":"me", \n"abc"test" \n "d": "e",\n "abc":"def"} \nabc';
//const textInput2 = '{"hey": "there", \n"test":"me", \n"a":["same"], \n"abc":"tet" \n "d": "e",\n "adi": "def"}';

//const textInput1 = '{hey": "\'there",\n "test":"me", \n"a":["same"], \n"abc"test" \n "d": "e",\n "abc":"def"}';
//const textInput2 = '{"hey": "there", \n"test":"me", \n"a":["same"], \n"abc":"tet" \n "d": "e",\n "aec": "deg"}';

// dsh todo add a comma under boo, it really messes this up
const textInput1 = `{
	"hey": {
		"boo": [
			{"who": "that 1",
			{"who2": "that2"}
		]
	},
	"hey2": {
		"boo": [
			{"who": "that 1"},
			{"who2": "that2"}
		]
	},
	"hey3": {
		"boo": [
			{"who": "that 1"},
			{"who2": "that2"}
		]
	}
}`;
const textInput2 = `{
	"hey": {
		"boo": [
			{"who": "that 1"},
			{"who2": "that2"}
		]
	},
	"hey2": {
		"boo": [
			{"who": "that 1"},
			{"who2": "that2"}
		]
	},
	"hey3": {
		"boo": [
			{"who": "that 1"},
			{"who2": "that2"}
		]
	}
}`;


/*
const textInput1 = `{"values" : { "MSP" : { "mod_policy": "Admins", "value" :   "config":{"admins" : ["sadf"],"crypto_config":null,"fabric_node_ous":null,"intermediate_certs":["asdf=","sfsaf="],"name":"PeerOrg1","organizational_unit_identifiers":[],"revocation_list":[],"root_certs":["asdf="],"signing_identity":null,"tls_intermediate_certs":["adsf","asdf"],"tls_root_certs":["dfs"]},"type":0}}}}`;
const textInput2 = `{
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
					"organizational_unit_identifiers": [
					],
					"revocation_list": [
					],
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
*/

/*
const textInput1 = `{
	"name": "msp1 Admin",
	"type": "identity,
	"private_key": "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tDQpNSUdIQWdFQU1CTUdCeXFHU000OUFnRUdDQ3FHU000OUF3RUhCRzB3YXdJQkFRUWdhYXhWa3QzSUVCZ21IeGYvDQpnL3dZSHNjUHdmM01ibEdsZWNtazdDMElocDZoUkFOQ0FBU1VJMDY3TEdHUmRpQUYzYzVsRkd5ZDg2WUg2eDFuDQp0MkNjUUdJdDBRdTBUdHRFNlh6b05YOTBFdkVBeVNOQ0k5cHk4Ym9Wc2t4WTY4OHo5UGgxSTRKRg0KLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLQ0K",
	"cert": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUIzRENDQVlLZ0F3SUJBZ0lVVzlTU1JCWEU2RFlneFZMMkdmMHU2MnlYemtRd0NnWUlLb1pJemowRUF3SXcKV2pFTE1Ba0dBMVVFQmhNQ1ZWTXhGekFWQmdOVkJBZ1REazV2Y25Sb0lFTmhjbTlzYVc1aE1SUXdFZ1lEVlFRSwpFd3RJZVhCbGNteGxaR2RsY2pFUE1BMEdBMVVFQ3hNR1JtRmljbWxqTVFzd0NRWURWUVFERXdKallUQWVGdzB5Ck1EQXpNak14TXpFNU1EQmFGdzB5TVRBek1qTXhNekkwTURCYU1DQXhEekFOQmdOVkJBc1RCbU5zYVdWdWRERU4KTUFzR0ExVUVBeE1FZEdWemREQlpNQk1HQnlxR1NNNDlBZ0VHQ0NxR1NNNDlBd0VIQTBJQUJKUWpUcnNzWVpGMgpJQVhkem1VVWJKM3pwZ2ZySFdlM1lKeEFZaTNSQzdSTzIwVHBmT2cxZjNRUzhRREpJMElqMm5MeHVoV3lURmpyCnp6UDArSFVqZ2tXallEQmVNQTRHQTFVZER3RUIvd1FFQXdJSGdEQU1CZ05WSFJNQkFmOEVBakFBTUIwR0ExVWQKRGdRV0JCVGpuK0pRMHhhTDNMK0ZyWDBCMmJudlVZVmYvREFmQmdOVkhTTUVHREFXZ0JTZXpRc0k5dTJNM082egorMlhyK0lwdDJydG40ekFLQmdncWhrak9QUVFEQWdOSUFEQkZBaUVBemp2REpqMFVveVk2d0FtaDZyN3VNcVRwCjJ4QTZNYkRhR0RmWHNuOUVwakVDSURLQ2kwWXBCNS8yQXVZTnFqRFJCNEZSQmVJbDE1cEJkVGxGdDdsVE5tV3AKLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo="
}`
const textInput2 = `{
	"name": "msp1 Admin",
	"type": "identity",
	"private_key": "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tDQpNSUdIQWdFQU1CTUdCeXFHU000OUFnRUdDQ3FHU000OUF3RUhCRzB3YXdJQkFRUWdhYXhWa3QzSUVCZ21IeGYvDQpnL3dZSHNjUHdmM01ibEdsZWNtazdDMElocDZoUkFOQ0FBU1VJMDY3TEdHUmRpQUYzYzVsRkd5ZDg2WUg2eDFuDQp0MkNjUUdJdDBRdTBUdHRFNlh6b05YOTBFdkVBeVNOQ0k5cHk4Ym9Wc2t4WTY4OHo5UGgxSTRKRg0KLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLQ0K",
	"cert": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUIzRENDQVlLZ0F3SUJBZ0lVVzlTU1JCWEU2RFlneFZMMkdmMHU2MnlYemtRd0NnWUlLb1pJemowRUF3SXcKV2pFTE1Ba0dBMVVFQmhNQ1ZWTXhGekFWQmdOVkJBZ1REazV2Y25Sb0lFTmhjbTlzYVc1aE1SUXdFZ1lEVlFRSwpFd3RJZVhCbGNteGxaR2RsY2pFUE1BMEdBMVVFQ3hNR1JtRmljbWxqTVFzd0NRWURWUVFERXdKallUQWVGdzB5Ck1EQXpNak14TXpFNU1EQmFGdzB5TVRBek1qTXhNekkwTURCYU1DQXhEekFOQmdOVkJBc1RCbU5zYVdWdWRERU4KTUFzR0ExVUVBeE1FZEdWemREQlpNQk1HQnlxR1NNNDlBZ0VHQ0NxR1NNNDlBd0VIQTBJQUJKUWpUcnNzWVpGMgpJQVhkem1VVWJKM3pwZ2ZySFdlM1lKeEFZaTNSQzdSTzIwVHBmT2cxZjNRUzhRREpJMElqMm5MeHVoV3lURmpyCnp6UDArSFVqZ2tXallEQmVNQTRHQTFVZER3RUIvd1FFQXdJSGdEQU1CZ05WSFJNQkFmOEVBakFBTUIwR0ExVWQKRGdRV0JCVGpuK0pRMHhhTDNMK0ZyWDBCMmJudlVZVmYvREFmQmdOVkhTTUVHREFXZ0JTZXpRc0k5dTJNM082egorMlhyK0lwdDJydG40ekFLQmdncWhrak9QUVFEQWdOSUFEQkZBaUVBemp2REpqMFVveVk2d0FtaDZyN3VNcVRwCjJ4QTZNYkRhR0RmWHNuOUVwakVDSURLQ2kwWXBCNS8yQXVZTnFqRFJCNEZSQmVJbDE1cEJkVGxGdDdsVE5tV3AKLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo="
}`
*/

/*
const textInput1 = `{
	"name": "msp1 Admin",
	"type": "identity,
	"private_key": "asdf",
	"cert": "1234="
}`
const textInput2 = `{
	"name": "msp1 Admin",
	"type": "identity",
	"private_key": "asdf",
	"cert": "1234="
}`
*/

/*
const textInput1 = `{
	"name": "msp1 Admin"
	"type": "identity",
	"private_key": "asdf",
	"cert": "1234="
}`
const textInput2 = `{
	"name": "msp1 Admin",
	"type": "identity",
	"private_key": "asdf",
	"cert": "1234="
}`
*/

/*
const textInput1 = `{
	"name": "msp1 Admin test"
	"type ": "identity",
	"private key"      : "asdf"
	"cert": "1234="
}`
const textInput2 = `{     
	"name": "msp1 Admin test",
	"type":        "identity",
	"private key": "asdf",
	"cert": "1234="
}`
*/

document.querySelector('#inputText').innerHTML = breakMeDown(textInput1, textInput2);

// pretty print json
function breakMeDown(orig_str, fixed_str) {
	let ret = '';
	let orig_lines = '';
	let fixed_lines = '';

	// one set of regex is better for stringified (1 line js) than the other
	// first set
	const og_break1 = break_items(orig_str.replace(/[\t\n\r]/g, '').replace(/\s*([^"])/g, '$1').replace(/[{]\s+"/g, '{"'));
	const fixed_break1= break_items(fixed_str.replace(/[\t\n\r]/g, '').replace(/\s*([^"])/g, '$1').replace(/[{]\s+"/g, '{"'));

	// second set
	const og_break2 = break_items(orig_str.replace(/[\t]/g, '').replace(/[{]\s+"/g, '{"').replace(/[\[]\s+"/g, '["').replace(/" +/g, '"').replace(/ +"/g, '"'));
	const fixed_break2 = break_items(fixed_str.replace(/[\t]/g, '').replace(/[{]\s+"/g, '{"').replace(/[\[]\s+"/g, '["').replace(/" +/g, '"').replace(/ +"/g, '"'));

	console.log('1 line diffs', Math.abs(og_break1.length - fixed_break1.length));
	console.log('2 line diffs', Math.abs(og_break2.length - fixed_break2.length));
	if (Math.abs(og_break2.length - fixed_break2.length) <= Math.abs(og_break1.length - fixed_break1.length)) {
		console.log('using regex set 2');
		orig_lines = og_break2;
		fixed_lines = fixed_break2;
	} else {
		console.log('using regex set 1');
		orig_lines = og_break1;
		fixed_lines = fixed_break1;
	}

	console.log(orig_lines);
	console.log(fixed_lines);

	let x = 0;
	for (let i = 0; i < orig_lines.length; i++) {
		if (orig_lines[x]) { orig_lines[i] = orig_lines[i].trim(); }
		if (fixed_lines[x]) { fixed_lines[x] = fixed_lines[x].trim(); }
		if (!orig_lines[i].replace(/:\s+/g, ':').trim() || !fixed_lines[x]) {						// do not print blank lines
			// nothing
		} else if (orig_lines[i].replace(/:\s+/g, ':') === fixed_lines[x].replace(/:\s+/g, ':')) {	// ignore space differences, print same same lines
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
	// dsh todo, if there are too many differences, just fix it? don't highlight differences...
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
			if (before.trim()) {
				ret.push(before);
			}
			str = after;
		} else {
			if (str.trim()) {
				ret.push(str);
			}
			break;
		}
	}
	return ret;

	function indexOfThings(str) {
		//const split_on = ['",', 'false,', 'true,', 'null,', '},', '],'];
		const split_on = [',', '\n'];
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
		//console.log(i, x, fixed_line[i], orig_line[x], ret, detectedDiff);

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
		//console.log(i, x, orig_line[i], fixed_line[x], ret, detectedDiff);

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
