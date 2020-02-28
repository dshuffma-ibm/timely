
const textInput1 = '{hey": ""there",\n "test":"me", \n"a":["same"], \n"abc"test"}';
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

function findAdditions(orig_line, fixed_line) {
	console.log('ol', orig_line);
	console.log('fl', fixed_line);
	let ret = '';
	let x = 0;
	let detectedDiff = false;
	for (let i = 0; i < orig_line.length; i++) {		// dsh change, should loop on the string that will be printed
		console.log('i', i, x, orig_line[i], fixed_line[x], ret);

		if (orig_line[i] === fixed_line[x]) {
			if (detectedDiff === true) {
				detectedDiff = false;
				ret += '</dif>';
			}
			ret += orig_line[i];
		} else {
			if (detectedDiff === false) {
				if (fixed_line[x + 1] !== orig_line[i]) {
					// if the next character in fixed doesn't match this orig character, than this char was deleted
					// probably at least
					if (fixed_line[x]) { ret += fixed_line[x]; }
					i++;
				} else {
					detectedDiff = true;
					ret += '<dif>' + fixed_line[x];
					i--;							// repeat
				}
			}
		}
		x++;
	}
	return ret;
}
