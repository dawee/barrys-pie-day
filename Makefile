run: clean build
	@node app.js

build: components
	@component build --dev -n barrys-pie-day

components: component.json
	@component install --dev

clean:
	rm -fr build components

.PHONY: clean
