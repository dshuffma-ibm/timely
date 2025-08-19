const jsObjMostCases = `{
		things: "stuff",
		"stuff": "things",
		'single': 'single',
		'has space': 'another space',
		'single': "double",
		'plus': "a + sign",
		'dash-in': "name",
		'many-dashes-in-key': "name",
		'empty': '',
		apostrophes1: 'boxes',
		apostrophes2: "boxes'",
		apostrophes3: "ted's",
		apostrophes4: \`ted's\`,
		a : {
			b: 1,
			c: [0,1,2,3,],
			david: 'this'
		},
		tickString: \`This is david's least favorite string, it has commas, and multiple apostrophes. bob's cans' of stuff\`,
		trailingComma: "comma",
	};`;

const jsonObj = {
	"sub_requirements": [
		{
			"name": "temperatureSet",
			"id": "9e1b7c2e-4e6a-4c0c-8b1e-2e7a1e8c1f3a",
			"description": "The system shall set the driver's favorite temperature as the heater's temperature, if internal temperature is below the driver's favorite temperature",
			"req_id": "1.6.1",
			"sub_requirements": [
			]
		}
	]
};

const jsObj = `
{
	sub_requirements: [
	  {
		'name': 'temperatureSet',
		id: '9e1b7c2e-4e6a-4c0c-8b1e-2e7a1e8c1f3a',
		description: \`The system shall set the driver's favorite temperature as the heater's temperature, if internal temperature is below the driver's favorite temperature\`,
		req_id: '1.6.1',
		sub_requirements: [],
	  },
	]
};`

console.log('loaded js2json test');

describe('js2json testing - ', function () {
	this.timeout(5000);

	it('should convert js to json adn back - most cases', (done) => {
		try {
			let converted = js2json(jsObjMostCases);
			assert.isString(converted);
			assert.isObject(JSON.parse(converted));

			// now convert it back to a js object
			let converted2 = json2js(converted);
			// if we made it here, then the function didn't throw an error, this is a little pointless
			// its hard to test if the js object is correct or not... we can't stringify it b/c its not JSON.
			assert.isString(converted2);
		} catch (e) {
			console.log('error', e);
			assert.fail('js2json test failed - a');
		}
		done();
	});

	it('should convert js to json - sysml', (done) => {
		try {
			let converted = js2json(jsObj);
			assert.isString(converted);
			assert.isObject(JSON.parse(converted));
		} catch (e) {
			console.log('error', e);
			assert.fail('js2json test failed - b');
		}
		done();
	});

	it('should convert json to json - sysml', (done) => {
		try {
			let converted = json2js(JSON.stringify(jsonObj));
			assert.isString(converted);

			let back = js2json(converted);
			assert.isString(back);
		} catch (e) {
			console.log('error', e);
			assert.fail('json2js test failed - c');
		}
		done();
	});
});
