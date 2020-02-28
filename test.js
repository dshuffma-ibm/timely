
const textInput1 = '{hey": "\'there",\n "test":"me", \n"a":["same"], \n"abc"test"}';
const textInput2 = '{"hey": "there", \n"test":"me", \n"a":["same"], \n"abc":"test"}';

document.querySelector('#inputText').innerHTML = breakMeDown(textInput1, textInput2);



// pretty print json
function breakMeDown(orig_str, fixed_str) {
	let ret = '';
	const orig_lines = orig_str.split('\n');
	const fixed_lines = fixed_str.split('\n');
	console.log('?', orig_lines);

	for (let i in orig_lines) {
		if (orig_lines[i] === fixed_lines[i]) {
			ret += '<sss>🗸 ' + orig_lines[i] + '</sss>\n';
		} else {
			ret += '<ogl>- ' + findAdditions(fixed_lines[i], orig_lines[i]) + '</ogl>\n';
			ret += '<edl>+ ' + findAdditions(orig_lines[i], fixed_lines[i]) + '</edl>\n';
		}
		ret += '\n';
	}

	console.log('?', ret);
	return ret;
}

//					other line, print-this-line
function findAdditions(orig_line, fixed_line) {
	console.log('ol', orig_line);
	console.log('fl', fixed_line);
	let ret = '';
	let x = 0;
	let detectedDiff = false;
	for (let i = 0; i < fixed_line.length; i++) {
		console.log('i', i, x, fixed_line[i], orig_line[x], ret, detectedDiff);

		if (fixed_line[i] === orig_line[x]) {
			if (detectedDiff === true) {
				detectedDiff = false;
				ret += '</dif>';
			}
			ret += fixed_line[i];
		} else {
			if (fixed_line[i + 1] === orig_line[x]) {
				console.log('here1');
				// if the next character in fixed does match this orig character, than this char was added (back on track)
				// probably at least
				if (detectedDiff === false) {
					detectedDiff = true;
					ret += '<dif>';
				}
				ret += fixed_line[i];
				x--;							// repeat
			} else if (fixed_line[i] === orig_line[x + 1]) {
				console.log('here2');
				// if the next character in orig matches this fixed character, than this char was deleted (back on track)
				// probably at least
				if (fixed_line[i]) { ret += fixed_line[i]; }
				x++;
			} else {
				console.log('here3');
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
