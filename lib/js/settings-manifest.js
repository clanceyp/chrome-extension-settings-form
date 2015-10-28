/**
 * @author patcla
 */
const DEBUG = false,
	TEST = false, // not used for Jasmine testing, used for off line development
	TEST_USE_FILTERID = false;

const FORMS = {
	"settings" : [
		{"type":"fieldset","label":"Settings","id":"basicSettings"},
		{"type":"fieldset","label":"Advanced Settings","id":"advancedSettings"},
		{"name":"test-text","label":"Text","type":"text", parent:'basicSettings'},
		{"name":"test-textarea","label":"Textarea","type":"textarea", parent:'basicSettings'},
		{"name":"test-checkbox","label":"Boolean","type":"checkbox", "value": "true", parent:'basicSettings'},
		{"name":"test-select","label":"Select","type":"select", "value":"none",parent:'basicSettings' ,options:{"none":"none","carbon_fibre":"carbon fibre","corkboard":"corkboard","dark_mosaic":"dark mosaic","moulin":"moulin","padded":"padded","simple_dashed":"simple dashed","squares":"squares","dark_wood":"wood, dark","wood_1":"wood, dark grey","purty_wood":"wood, purty","retina_wood":"wood, retina"}},
		{"name":"test-radio","label":"Options","type":"radio", parent:'basicSettings' ,options:{"female":"Female","male":"Male"}},
		{"name":"test-range","label":"Range","type":"text", "html5":"range",  parent:'basicSettings',value:100,ops:{"min":5,"max":120,"step":5},data:{"suffix":"s"}},
		{"name":"test-email","label":"Email","type":"text","html5":"email", parent:'basicSettings'},
		{"name":"test-color","label":"Colour","type":"text","html5":"color", parent:'advancedSettings'},
		{"name":"test-date","label":"Date","type":"text","html5":"date", parent:'advancedSettings'},
		{"name":"test-key-value-pair", "label":"Key value pair", "type" : "key-value", tag:"div", parent:'advancedSettings', cols : '[{"item":{"type":"text","id":"host"}},{"item":{"type":"text","id":"ip"}}]'},
		{}
	],
	"legacy-settings" : [
		{"type":"fieldset","label":"Settings","id":"basicSettings"},
		{"type":"fieldset","label":"Advanced Settings","id":"advancedSettings"},
		{"name":"test-text","label":"Text","type":"text", parent:'basicSettings'},
		{"name":"test-email","label":"Email","type":"text","html5":"email", parent:'basicSettings'},
		{"name":"test-color","label":"Colour","type":"text","html5":"color", parent:'basicSettings'},
		{"name":"test-date","label":"Date","type":"text","html5":"date", parent:'basicSettings'},
		{"id":"ColumnInfo_container", "label":"some title", "type" : "key-value", tag:"div", parent:'basicSettings', cols : '[{"item":{"type":"text","id":"host"}},{"item":{"type":"text","id":"ip"}}]'},
		{"name":"API","label":"Stash JSON url","type":"text", className:"allowDblClickReset",  parent:'advancedSettings'},
		{"name":"AuthorAPI","label":"Stash Author JSON url","type":"text", className:"allowDblClickReset",  parent:'advancedSettings'},
		{"name":"AllowNotifications","label":"Show notifications","type":"checkbox", parent:'basicSettings'},
		{"name":"RefreshTime","label":"Refresh time","type":"text", className:"allowDblClickReset","html5":"range",  parent:'advancedSettings',ops:{"min":5,"max":120,"step":5,"range-type":"s"}},
		{"name":"BackgroundImage","label":"Background image","type":"select", className:"allowDblClickReset bgImagePrivew",  parent:'advancedSettings' ,options:{"none":" - no image","carbon_fibre":"carbon fibre","corkboard":"corkboard","dark_mosaic":"dark mosaic","moulin":"moulin","padded":"padded","simple_dashed":"simple dashed","squares":"squares","dark_wood":"wood, dark","wood_1":"wood, dark grey","purty_wood":"wood, purty","retina_wood":"wood, retina"}},
		{"name":"BackgroundImage2","label":"Background image 2","type":"radio", className:"allowDblClickReset bgImagePrivew",  parent:'advancedSettings' ,options:{"none":" - no image","carbon_fibre":"carbon fibre","corkboard":"corkboard","dark_mosaic":"dark mosaic","moulin":"moulin","padded":"padded","simple_dashed":"simple dashed","squares":"squares","dark_wood":"wood, dark","wood_1":"wood, dark grey","purty_wood":"wood, purty","retina_wood":"wood, retina"}},
		{"name":"Test","label":"test config","type":"button","className":"displayonly",value:"validate","hidden":"hideAuth", parent:'basicSettings'},
		{"label":"Popup config","type":"title","tag":"h3", parent:'basicSettings'},
		{"label":"Popup config","type":"title","tag":"h3", parent:'advancedSettings'},
		{"name":"PopupTitle","label":"Title","type":"text", parent:'basicSettings'},
		{"name":"PopupTitleLink","label":"Title link URL","type":"text",  parent:'advancedSettings'},
		{"name":"PopupTemplate","label":"Mustache template","type":"textarea",  parent:'advancedSettings', className:"allowDblClickReset"},
		{"name":"PopupDateformat","label":"Date format","type":"text", parent: 'advancedSettings'},
		{"name":"PopupReverseOrder","label":"Reverse order","type":"checkbox", parent:'basicSettings'},
		{"name":"DifferentiateApproved","label":"Differentiate approved","type":"checkbox", parent: 'advancedSettings'},
		{"name":"AuthorTabEnabled","label":"Show your created requests","type":"checkbox", parent:'basicSettings'},
	]
};

const DEFAULT_VALUES = {
	"timeout": 200000 // 20 seconds
	,"AllowNotifications" : "false"
	,"PopupReverseOrder": "false"
	,"DifferentiateApproved": "true"
	,"URL":"http://stash.my-domain.com/"
	,"API":"/rest/inbox/latest/pull-requests?role=reviewer&limit=20"
	,"AuthorAPI":"/rest/inbox/latest/pull-requests?role=author&amp;limit=20"
	,"AuthorTabEnabled": "true"
	,"PopupTitle":"Ready for Review"
	,"PopupTemplate":'{{#stash}}'+
'\n<details class="item item--reviewer-approved-{{ reviewerApproved }}">'+
'\n	 <summary>{{date createdDate}} {{title}}</summary>'+
'\n	 <div class="item__content">'+
'\n		<h3><a href="{{links.self.0.href}}">{{title}}</a></h3>'+
'\n		<p>Created by: {{author.user.displayName}}</p>'+
'\n 	<pre>{{description}}</pre>'+
'\n		<div class="cell item__reviewers">'+
'\n			<h3>Reviewers:</h3> '+
'\n			{{#reviewers}}'+
'\n				<i class="item__reviewers-reviewer item__reviewers-reviewer--approved-{{approved}}">{{user.displayName}}</i>'+
'\n			{{/reviewers}}'+
'\n		</div>'+
'\n		<div class="cell">'+
'\n			<h3>Participants:</h3> '+
'\n			{{#participants}}'+
'\n				{{user.displayName}}<br/>'+
'\n			{{/participants}}'+
'\n		</div>'+
'\n  </div>'+
'\n</details>'+
'\n{{/stash}}'
	,"PopupDateformat":"d MMM"
    ,"RefreshTime":60
	,"TESTVALUE":"ABC"
};
const HELP = {
	"timeout": 'Length of time to wait before assuming the connection has failed'
	,"AllowNotifications": 'Allow popup notifications (can be very irritating)'
	,"DifferentiateApproved": 'Visually differentiate items that have been approved by anyone'
	,"URL":'Your STASH URL e.g. http://stash.my-domain.com/'
	,"API":'Relative path e.g. /rest/inbox/latest/pull-requests?role=reviewer&amp;limit=10<br/>role - must be one of [AUTHOR, REVIEWER, PARTICIPANT]<br/>limit - max number of results'
	,"PopupTitle":'Title of the filter to show in the extension popup'
	,"PopupTitleLink": 'Optional, link for the title text on the popup, from the Stash URL, e.g. /projects/MYREPOS/repos/MYPROJECT/pull-requests'
	,"PopupTemplate":'HTML template used for each ticket by the extension popup (mustache format) <a href="#" class="json-viewer">view stash item json</a>'
	,"PopupDateformat": 'Date format used by the mustache template, see <a href="https://code.google.com/p/datejs/wiki/FormatSpecifiers#CUSTOM_DATE_AND_TIME_FORMAT_SPECIFIERS">datejs wiki</a> for supported formats. Example usage {{date createdDate}}'
	,"RefreshTime":'Frequency to check server for changes (in seconds)'
	,"PopupReverseOrder":'Reverse the display order (default is newest first)'
	,"AuthorTabEnabled": 'Show pull requests you created in the popup'
}
