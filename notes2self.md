
# Add add temp id to use storage
>
	"applications": {
		"gecko": {
			"id": "addon2@example.com"
		}
	}

# Debug as Webpage:
- its easier to debug this tool as a normal webpage. the console behavior is much better.
- open `index.html` or `timely.html` in browser and open browser's developer tools
- limits: cannot debug storage settings here though...

# Debug as AddOn:
- open browser console with `ctrl` + `shift` + `j`
- click gear, click `Show Content Messages`
- see logs!


# Run Tests:
- `npm test`
	- this should run all test files defined in `karama.config.js`, the `files` setting
	- uses a headless browser
	- debug tests steps:
		- todo