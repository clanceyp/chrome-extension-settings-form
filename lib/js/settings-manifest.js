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
	]
};

const DEFAULT_VALUES = {
	"test-text": "hello",
	"test-range": 95
};
const HELP = {
	"test-text": 'Some help text',
	"test-range": 'Some other something text'
}
