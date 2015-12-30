Settings
==============

This project adds a basic options page to your chrome extension 

## Getting started 

Add the /libs/options folder to your project and update your extension manifest.json to use the /libs/options/index.html as the options form.
Update your background page to reference the options manifest, options background page and one or two dependencies.
```
	// add to extension manifest.json //
	...
    "options_page": "lib/options/index.html",
    "background":{
		"scripts": [
			"lib/options/js/manifest.js",
			"lib/options/js/vendor/underscore.js",
			"lib/options/js/vendor/zepto.js",
			"lib/options/js/background.js",
			...
		]
	}
	...
```

Use the /libs/options/manifest.js to setup your form element and default values.
Add "fieldset" elements to create sections (sections get automatically added to the navigation)

```
	{"type":"fieldset","label":"Settings","id":"basicSettings","defaultSection":"true"}
	// type : when type is set to fieldset 
	// 		label : mandatory 
	// 		id : mandatory
	// 		defaultSection : optional, 	should be set to true on the default fieldset 
	//									which should be visible when the page loads 
```

## Accessing options in your chrome extension

In your popup and options pages use chrome.extension.getBackgroundPage() to access options 

```
var backgroundPage = chrome.extension.getBackgroundPage();

backgroundPage.options.setLocalStore(key, value)
backgroundPage.options.resetLocalStore(key)

backgroundPage.options.getLocalStore(key)
backgroundPage.options.getLocalStore(key, fallback)
backgroundPage.options.getLocalStore(key, fallback, fn)

```


## License

The MIT License (MIT)
