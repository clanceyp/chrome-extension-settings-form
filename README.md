Settings
==============

This project adds a basic options page to your chrome extension 

## Getting started 

Add the /libs/options folder to your project and update your extension manifest.json to use the /libs/options/index.html as the options form.
Update your background page to reference the options manifest, options background page and one or two dependencies.
```
    "options_page": "lib/options/index.html",
    "background":{
		"scripts": [
			"lib/options/js/manifest.js",
			"lib/options/js/vendor/underscore.js",
			"lib/options/js/vendor/zepto.js",
			"lib/options/js/background.js"
		]
	}
```
## Basic settings page

api
    settings.get(key);
    settings.set(key, value);
    // presuming you set the global scope
    // to 'settings'


## License

The MIT License (MIT)
