dev:
	@./node_modules/.bin/budo example.js --live --open

test:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter spec

check:
	browserify index.js | uglifyjs

.PHONY: test
