const {writeFile} = require('fs');
const {promisify} = require('util');
const babel = require('babel-core');
const uglifyES = require('uglify-es');
const {version, author, homepage} = require('./package.json');

(async () => {
	const copyrightNotice = `/**
 * Froala Editor Paragraph Format Extended plugin v${version} (${homepage})
 * Copyright 2016-${new Date().getFullYear()} ${author.name}
 * Licensed under the MIT license
 */
`;

	// Building the full code
	let {code} = await promisify(babel.transformFile)('./src/paragraph_format_extended.js', {
		presets: [
			['env', {
				targets: {
					// According to https://github.com/froala/wysiwyg-editor#browser-support
					browsers: [
						'last 2 Chrome major versions',
						'last 2 Edge major versions',
						'last 2 Firefox major versions',
						'last 2 Safari major versions',
						'last 2 Opera major versions',
						'IE >= 10',
						'last 2 iOS major versions',
						'last 2 ChromeAndroid major versions',
						'last 2 FirefoxAndroid major versions',
						'last 2 Android major versions'
					]
				}
			}]
		],
		plugins: [
			'transform-object-rest-spread',
			['transform-es2015-modules-umd', {
				globals: {
					jquery: 'jQuery',
					'froala-editor': 'jQuery.fn.froalaEditor'
				},
				exactGlobals: true
			}]
		]
	});
	await promisify(writeFile)('./dist/paragraph_format_extended.js', copyrightNotice + code);
	console.log('`dist/paragraph_format_extended.js` has been built');

	// Building the minified code
	code = uglifyES.minify(code).code;
	promisify(writeFile)('./dist/paragraph_format_extended.min.js', copyrightNotice + code);
	console.log('`dist/paragraph_format_extended.min.js` has been built');
})();
