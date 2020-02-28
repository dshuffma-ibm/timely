
const textInput1 = '{hey": "\'there",\n "test":"me", \n"a":["same"], \n"abc"test" \n "d": "e",\n "abc":"def"}';
const textInput2 = '{"hey": "there", \n"test":"me", \n"a":["same"], \n"abc":"tet" \n "d": "e",\n "ghi": "jkl"}';

document.querySelector('#inputText').innerHTML = breakMeDown(textInput1, textInput2);



// pretty print json
function breakMeDown(orig_str, fixed_str) {
	let ret = '';
	const orig_lines = orig_str.split('\n');
	const fixed_lines = fixed_str.split('\n');
	for (let i in orig_lines) {
		if (orig_lines[i] === fixed_lines[i]) {
			ret += '<sss>🗸 ' + orig_lines[i] + '</sss>\n';
		} else {
			ret += '<ogl>- ' + findDeletions(orig_lines[i], fixed_lines[i]) + '</ogl>\n';
			ret += '<edl>+ ' + findAdditions(orig_lines[i], fixed_lines[i]) + '</edl>\n';
		}
		ret += '\n';
	}
	return ret;
}

//					other line, print-this-line
function findAdditions(orig_line, fixed_line) {
	console.log('findAdditions ol', orig_line);
	console.log('findAdditions fl', fixed_line);
	let ret = '';
	let x = 0;
	let detectedDiff = false;
	for (let i = 0; i < fixed_line.length; i++) {
		console.log(i, x, fixed_line[i], orig_line[x], ret, detectedDiff);

		if (fixed_line[i] === orig_line[x]) {
			if (detectedDiff === true) {
				detectedDiff = false;
				ret += '</dif>';
			}
			ret += fixed_line[i];
		} else {
			if (fixed_line[i + 1] === orig_line[x]) {
				// if the next character in fixed does match this orig character, than this char was added (back on track)
				// probably at least
				if (detectedDiff === false) {
					detectedDiff = true;
					ret += '<dif>';
				}
				ret += fixed_line[i];
				x--;							// repeat
			} else if (fixed_line[i] === orig_line[x + 1]) {
				// if the next character in orig matches this fixed character, than this char was deleted (back on track)
				// probably at least
				if (fixed_line[i]) { ret += fixed_line[i]; }
				x++;							// skip deleted char
			} else {
				if (detectedDiff === false) {
					detectedDiff = true;
					ret += '<dif>';
				}
				ret += fixed_line[i];
				x--;							// repeat
			}
		}
		x++;
	}
	return ret;
}

function findDeletions(orig_line, fixed_line) {
	console.log('findDeletions ol', orig_line);
	console.log('findDeletions fl', fixed_line);
	let ret = '';
	let x = 0;
	let detectedDiff = false;
	for (let i = 0; i < orig_line.length; i++) {
		console.log(i, x, orig_line[i], fixed_line[x], ret, detectedDiff);

		if (orig_line[i] === fixed_line[x]) {
			if (detectedDiff === true) {
				detectedDiff = false;
				ret += '</dif>';
			}
			ret += orig_line[i];
		} else {
			if (orig_line[i] === fixed_line[x + 1]) {
				// if the next character in fixed does match this orig character, than this char was added (back on track)
				// probably at least
				if (orig_line[i]) { ret += orig_line[i]; }
				x++;							// skip added char
			} else if (orig_line[i + 1] === fixed_line[x]) {
				// if the next character in orig matches this fixed character, than this char was deleted (back on track)
				// probably at least
				if (detectedDiff === false) {
					detectedDiff = true;
					ret += '<dif>';
				}
				ret += orig_line[i];
				x--;							// repeat
			} else {
				if (orig_line[i]) { ret += orig_line[i]; }
				x++;							// skip added char
			}
		}
		x++;
	}
	return ret;
}
