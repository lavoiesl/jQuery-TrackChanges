# Automatically minifies using Closure Compiler API

PLUGIN = trackChanges
CURL = curl
COMPILATION_LEVEL = SIMPLE_OPTIMIZATIONS
POST_DATA = -d compilation_level=$(COMPILATION_LEVEL) -d output_format=text -d output_info=compiled_code
CLOSURE_URL = http://closure-compiler.appspot.com/compile


minify: build build/jQuery.$(PLUGIN).min.js

build:
	mkdir build

rebuild: clean minify

build/%.min.js: src/%.js
	$(CURL) -s $(POST_DATA) --data-urlencode "js_code@$<" "$(CLOSURE_URL)" > $@

clean:
	rm -Rf build
