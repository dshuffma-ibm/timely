
//const textInput1 = '{hey": "\'there",\n "test":"me", \n"a":["same"], \n"abc"test" \n "d": "e",\n "abc":"def"}';
//const textInput2 = '{"hey": "there", \n"test":"me", \n"a":["same"], \n"abc":"tet" \n "d": "e",\n "ghi": "jkl"}';

//const textInput1 = '{hey": "\'there",\n "test":"me", \n"abc"test" \n "d": "e",\n "abc":"def"} \nabc';
//const textInput2 = '{"hey": "there", \n"test":"me", \n"a":["same"], \n"abc":"tet" \n "d": "e",\n "adi": "def"}';

//const textInput1 = '{hey": "\'there",\n "test":"me", \n"a":["same"], \n"abc"test" \n "d": "e",\n "abc":"def"}';
//const textInput2 = '{"hey": "there", \n"test":"me", \n"a":["same"], \n"abc":"tet" \n "d": "e",\n "aec": "deg"}';

const textInput1 = `{
    "hey": {
        "boo": [
            {"who": "that 1"
            ,{"who2": "that2"}
        ]
    }
}`;
const textInput2 = `{
	"hey": {
		"boo": [
			{"who": "that 1"},
			{"who2": "that2"}
		]
	}
}`;
document.querySelector('#inputText').innerHTML = breakMeDown(textInput1, textInput2);

function break_after(str, characters) {
	const ret = [];
	for (let i = 0; i < str.length - 1;) {
		ret.push(str.substring(i, i + characters));
		i += characters;
	}
	return ret;
}

// pretty print json
function breakMeDown(orig_str, fixed_str) {
	let ret = '';
	const LEN = 100;
	const orig_lines = break_after(orig_str.replace(/\t/g, '').replace(/\s*([^"])/g, '$1'), LEN);
	const fixed_lines = break_after(fixed_str.replace(/\t/g, '').replace(/\s*([^"])/g, '$1'), LEN);
	console.log(orig_lines);
	console.log(fixed_lines);

	let x = 0;
	for (let i = 0; i < orig_lines.length; i++) {
		orig_lines[i] = orig_lines[i].trim();
		fixed_lines[x] = fixed_lines[x].trim();
		if (orig_lines[i] === fixed_lines[x]) {
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

//					other line, print-this-line
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
