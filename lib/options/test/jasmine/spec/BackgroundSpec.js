var backgroundPage = chrome.extension.getBackgroundPage();

// backgroundPage.options.getLocalStore(key, fallback, fn)
// backgroundPage.options.setLocalStore(key)


describe("Background options API", function() {

	it("moc backgroundPage object is working", function() {

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
			OPTIONS.DEFAULT_VALUES[key] = value;
			expect( backgroundPage.options.getLocalStore(key) ).toBe( value );
		});

		it("it gets default value from OPTIONS.DEFAULT_VALUES over fallback", function() {
			var key = "jasmine-test-001-key",
				value = "jasmine-test-001-value",
				fallback = 'fallback-value';
			OPTIONS.DEFAULT_VALUES[key] = value;
			expect( backgroundPage.options.getLocalStore(key, fallback) ).toBe( value );
		});

		it("it gets function value if present", function() {
			var fallback = 'fallback-value',
				fn = function(){ return "string-from-function";};
			expect( backgroundPage.options.getLocalStore('i-dont-exist', fallback, fn) ).toBe( "string-from-function" );
		});

		it("function amends value", function() {
			var fallback = 'fallback-value',
				fn = function(val){ return val.toUpperCase();},
				key = "jasmine-test-001-key",
				value = "jasmine-test-001-value";

			OPTIONS.DEFAULT_VALUES[key] = value;

			expect( backgroundPage.options.getLocalStore(key, null, fn) ).toBe( value.toUpperCase() );
			expect( backgroundPage.options.getLocalStore('i-dont-exist', fallback, fn) ).toBe( fallback.toUpperCase() );
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
			runs(function(){
				backgroundPage.options.setLocalStore(key, value);
			});
			runs(function() {
				expect( backgroundPage.options.getLocalStore(key) ).toBe( value );
			});
		});
	});

	describe("Background page backgroundPage.options.resetLocalStore(key)", function() {
		it("it removes a key / value pair", function() {
			var key = "jasmine-test-002-key",
				value = "jasmine-test-002-value";
			runs(function(){
				backgroundPage.options.setLocalStore(key, value);
			});
			runs(function() {
				expect( backgroundPage.options.getLocalStore(key) ).toBe( value );
			});
			runs(function() {
				backgroundPage.options.resetLocalStore(key);
			});
			runs(function() {
				expect( backgroundPage.options.getLocalStore(key) ).toBe( null );
			});
		});
	});


});
