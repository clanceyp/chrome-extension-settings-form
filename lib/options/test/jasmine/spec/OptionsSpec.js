var backgroundPage = chrome.extension.getBackgroundPage();

// backgroundPage.options.getLocalStore(key, fallback, fn)
// backgroundPage.options.setLocalStore(key)


describe("Background options API", function() {

	it("backgroundPage object is working", function() {
		// if not running in an extension
		// include the jasmine/moc/background.js
		expect( typeof backgroundPage.options ).toBe( "object" );

	});

	describe("Background page backgroundPage.options.getLocalStore(key, fallback, fn)", function() {

		it("it gets null if value not set", function() {
			expect( backgroundPage.options.getLocalStore('i-dont-exist') ).toBe( null );
		});

		it("it gets fallback value if value not set", function() {
			var fallback = 'fallback-value';
			expect( backgroundPage.options.getLocalStore('i-dont-exist', fallback) ).toBe( fallback );
		});

		it("it gets default value from OPTIONS.DEFAULT_VALUES", function() {
			var key = "jasmine-test-001-key",
				value = "jasmine-test-001-value";
			expect( backgroundPage.options.getLocalStore(key) ).toBe( value );
		});

		it("it gets default value from OPTIONS.DEFAULT_VALUES over fallback", function() {
			var key = "jasmine-test-001-key",
				value = OPTIONS.DEFAULT_VALUES[key],
				fallback = 'fallback-value';
			expect( backgroundPage.options.getLocalStore(key, fallback) ).toBe( value );
		});

		it("it gets function value if present", function() {
			var fallback = 'fallback-value',
				fn = function(){ return "string-from-function";};
			expect( backgroundPage.options.getLocalStore('i-dont-exist', fallback, fn) ).toBe( "string-from-function" );
		});

		it("function amends value", function() {
			var fallback = 'fallback-value',
				FALLBACK = fallback.toUpperCase(),
				fn = function(val){ return val.toUpperCase();},
				key = "jasmine-test-001-key",
				value = OPTIONS.DEFAULT_VALUES[key],
				VALUE = value.toUpperCase();

			OPTIONS.DEFAULT_VALUES[key] = value;

			expect( backgroundPage.options.getLocalStore(key, null, fn) ).toBe( VALUE );
			expect( backgroundPage.options.getLocalStore('i-dont-exist', fallback, fn) ).toBe( FALLBACK );
		});

		it("it gets number if requested", function() {
			expect( backgroundPage.options.getLocalStore('i-dont-exist', "0", "number") ).toBe( 0 );
			expect( backgroundPage.options.getLocalStore('i-dont-exist', "1", "number") ).toBe( 1 );
		});


		it("it gets boolean value if requested", function() {
			expect( backgroundPage.options.getLocalStore('i-dont-exist', 'true', 'boolean') ).toBe( true );
			expect( backgroundPage.options.getLocalStore('i-dont-exist', 'TRUE', 'boolean') ).toBe( true );
			expect( backgroundPage.options.getLocalStore('i-dont-exist', '1', 'boolean') ).toBe( true );
			expect( backgroundPage.options.getLocalStore('i-dont-exist', 1, 'boolean') ).toBe( true );
			expect( backgroundPage.options.getLocalStore('i-dont-exist', 12345, 'boolean') ).toBe( true );
			expect( backgroundPage.options.getLocalStore('i-dont-exist', 'on', 'boolean') ).toBe( true );
			expect( backgroundPage.options.getLocalStore('i-dont-exist', 'false', 'boolean') ).toBe( false );
			expect( backgroundPage.options.getLocalStore('i-dont-exist', 'FALSE', 'boolean') ).toBe( false );
			expect( backgroundPage.options.getLocalStore('i-dont-exist', '0', 'boolean') ).toBe( false );
			expect( backgroundPage.options.getLocalStore('i-dont-exist', 0, 'boolean') ).toBe( false );
			expect( backgroundPage.options.getLocalStore('i-dont-exist', -1, 'boolean') ).toBe( false );
			expect( backgroundPage.options.getLocalStore('i-dont-exist', 'off', 'boolean') ).toBe( false );
			expect( backgroundPage.options.getLocalStore('i-dont-exist', 'any-random-string', 'boolean') ).toBe( false );
			expect( backgroundPage.options.getLocalStore('i-dont-exist', '', 'boolean') ).toBe( false );
			expect( backgroundPage.options.getLocalStore('i-dont-exist', null, 'boolean') ).toBe( false );
			expect( backgroundPage.options.getLocalStore('i-dont-exist', window.undefined, 'boolean') ).toBe( false );
		});

	});

	describe("Background page backgroundPage.options.setLocalStore(key, value)", function() {
		it("it sets a key / value pair", function() {
			var key = "jasmine-test-002-key",
				value = "jasmine-test-002-value";
			backgroundPage.options.setLocalStore(key, value);
			expect( backgroundPage.options.getLocalStore(key) ).toBe( value );
		});
	});

	describe("Background page backgroundPage.options.resetLocalStore(key)", function() {
        var key = "jasmine-test-002-key",
            value = "jasmine-test-002-value";
        backgroundPage.options.setLocalStore(key, value);
		it("it removes a key / value pair", function() {
			backgroundPage.options.resetLocalStore(key);
			expect( backgroundPage.options.getLocalStore(key) ).toBe( null );
		});
	});


});


describe("OptionsForm API", function() {

	it("window.optionsForm object is loaded", function() {

		expect( typeof window.optionsForm ).toBe( "object" );

	});

	beforeEach(function(){
		$("body").append("<div id=foo />");
	});

	afterEach(function(){
		$("#foo").remove();
	});

	describe("optionsForm.createRow.basic(element)", function() {


		it("it creates a form element", function(){
			optionsForm.createRow.basic({
				id: "foo-id",
				type: "text",
				html5: "number",
				name: "test-element",
				attr: [],
				data: [],
				parent: document.querySelector("#foo")
			});
			expect( document.querySelectorAll("input#foo-id").length ).toBe( 1 );
		});
		it("it creates a form element with HTML5 type", function() {
			optionsForm.createRow.basic({
				id: "foo-id-1",
				type: "text",
				html5: "number",
				name: "test-element",
				attr: [],
				data: [],
				parent: document.querySelector("#foo")
			});
			optionsForm.createRow.basic({
				id: "foo-id-2",
				type: "text",
				html5: "datalist",
				name: "test-element",
				attr: [],
				data: [],
				options: [{"foo":"bar"}, {"baz":"qux"}],
				parent: document.querySelector("#foo")
			});
			// alert(document.querySelector("#foo").innerHTML)
			expect( document.querySelectorAll("input#foo-id-1[type='number']").length ).toBe( 1 );
			expect( document.querySelectorAll("input#foo-id-2[list='datalist-foo-id-2']").length ).toBe( 1 );
			expect( document.querySelectorAll("datalist#datalist-foo-id-2").length ).toBe( 1 );
		});
		it("it creates a form element with data", function() {
			optionsForm.createRow.basic({
				id: "foo-id",
				type: "text",
				name: "test-element",
				attr: [],
				data: [{"foo":"bar"}, {"baz":"qux"}],
				parent: document.querySelector("#foo")
			});
			expect( document.querySelectorAll("input#foo-id[data-foo][data-baz]").length ).toBe( 1 );
			expect( document.querySelector("input#foo-id[data-foo][data-baz]").getAttribute("data-foo") ).toBe( "bar" );
			expect( document.querySelector("input#foo-id[data-foo][data-baz]").getAttribute("data-baz") ).toBe( "qux" );
		});
		it("it creates a form element with attributes", function() {
			optionsForm.createRow.basic({
				id: "foo-id",
				type: "text",
				name: "test-element",
				attr: [{"foo":"bar"}, {"baz":"qux"}],
				data: [],
				parent: document.querySelector("#foo")
			});
			expect( document.querySelectorAll("input#foo-id[foo][baz]").length ).toBe( 1 );
			expect( document.querySelector("input#foo-id[foo][baz]").getAttribute("foo") ).toBe( "bar" );
			expect( document.querySelector("input#foo-id[foo][baz]").getAttribute("baz") ).toBe( "qux" );

		});
		it("it creates a form element with a bespoke className", function() {

            optionsForm.createRow.basic({
                id: "foo-id",
                type: "text",
                name: "test-element",
                attr: [{"foo": "bar"}, {"baz": "qux"}],
                data: [],
                className: "foo-bar-baz",
                parent: document.querySelector("#foo")
            });

            expect(document.querySelectorAll(".foo-bar-baz").length).toBe(1);
        });
	});

	describe("optionsForm.createRow.title(element)", function() {

		it("it creates a non-form element", function() {

			optionsForm.createRow.title({
				id: "foo-id-1",
				type: "label",
				tag : "p",
				attr: [],
				data: [],
				parent: document.querySelector("#foo")
			});
			optionsForm.createRow.title({
				id: "foo-id-2",
				type: "label",
				tag : "h2",
				attr: [],
				data: [],
				parent: document.querySelector("#foo")
			});
			optionsForm.createRow.title({
				id: "foo-id-3",
				type: "label",
				tag : "h3",
				attr: [],
				data: [],
				parent: document.querySelector("#foo")
			});

			expect( document.querySelectorAll("#foo p").length ).toBe( 1 );
			expect( document.querySelectorAll("#foo h2").length ).toBe( 1 );
			expect( document.querySelectorAll("#foo h3").length ).toBe( 1 );

		});
	});

});