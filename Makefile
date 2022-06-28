install:
	npm ci

publish:
	npm publish --dry-run

lint:
	npx eslint .

test:
	npx jest --coverage

build:
	npm run build

#запуск веб сервера
launch:
	npx webpack serve