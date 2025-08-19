// Karma configuration
// Generated on Mon Nov 26 2018 21:25:04 GMT-0500 (EST)

module.exports = function (config) {
	config.set({

		// base path that will be used to resolve all patterns (e.g. files, exclude)
		basePath: '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['mocha', 'chai'],

		// list of files / patterns to load in the browser
		files: [
			{ pattern: './setup.test.js', watched: false },
			{ pattern: '../asn1js/base64.js', watched: false },
			{ pattern: '../asn1js/oids.js', watched: false },
			{ pattern: '../asn1js/int10.js', watched: false },
			{ pattern: '../asn1js/asn1.js', watched: false },
			{ pattern: '../common.js', watched: true },
			{ pattern: '../popup/actions.js', watched: true },
			{ pattern: '../popup/timely.js', watched: true },
			{ pattern: './js2json.test.js', watched: true },
			{ pattern: './asn1.test.js', watched: true },
			{ pattern: './magic.test.js', watched: false },
		],

		// list of files / patterns to exclude
		exclude: [],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			//'**/test/index.test.js': ['coverage']
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress'],

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browserDisconnectTimeout: 10000,
		browserDisconnectTolerance: 0,
		browserNoActivityTimeout: 60000,
		browsers: ['Chrome', 'ChromeHeadless', 'ChromeHeadlessNoSandbox'],
		customLaunchers: {
			ChromeHeadlessNoSandbox: {
				base: 'ChromeHeadless',
				flags: ['--no-sandbox']
			}
		},

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity,

		// optionally, configure the reporter
		/*coverageReporter: {
			type: 'html',
			dir: 'coverage/'
		},*/

		// Socket.io pingTimeout in ms
		pingTimeout: 10000
	});
};
