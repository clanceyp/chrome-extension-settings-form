Options form
==============

This project adds a basic options page to your chrome extension 

## Getting started 

Add the /libs/options folder to your project and update your extension manifest.json to use the /libs/options/index.html as the options form.
Update your background page to reference the options manifest, options background page and one or two dependencies. (you wont need zepto if your have jQuery arleady)

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
Add "fieldset" elements to create sections (sections get automatically added to the navigation). See the default options/index.html for a working example.

```javascript
// extract from manifest.js
	... 
	// basic section example... 
	{"type":"fieldset","label":"Settings","id":"basicSettings","defaultSection":"true"} // default form
	{"type":"fieldset","label":"Advanced Settings","id":"advancedSettings"} // add extra panels 
	...
	// type : when type is set to fieldset 
	// 		label : mandatory (Section header and menu link text)
	// 		id : mandatory (must be unique)
	// 		defaultSection : optional, 	should be set to true on the default fieldset 
	//									flags which section is visible when the options page loads, 
										only one section can be the defaultSection
										
	// basic form element example	
	...
	{"name":"", "label":"", "type":"text", parent:'basicSettings', attr: [], data: []},
    ...
    // name : mandatory 
    // label : [used as the label text]
    // type : [form element type, if using HTML5 set this to "text"]
    // html5 : [form element type e.g. 'date', 'color', 'number' etc... ]
    // parent : [parent element id]
    // attr : [array, adds attributes to form element]
    // data : [array, adds data attributes to for element]
```

## Accessing options in your chrome extension

In your background page use the window.options 

```javascript
options.setLocalStore(key, value)
options.resetLocalStore(key)

options.getLocalStore(key)
options.getLocalStore(key, fallback)
options.getLocalStore(key, fallback, fn)

```

In your popup and options pages use chrome.extension.getBackgroundPage() to access options. 

```javascript
var backgroundPage = chrome.extension.getBackgroundPage();

backgroundPage.options.setLocalStore(key, value)
backgroundPage.options.resetLocalStore(key)

backgroundPage.options.getLocalStore(key)
backgroundPage.options.getLocalStore(key, fallback)
backgroundPage.options.getLocalStore(key, fallback, fn)

```
See options/test/spec/OptionsSpec.js for usage examples


## License

The MIT License (MIT)
