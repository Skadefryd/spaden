# Spaden - the FINN.no CSS framework

There is a Scandnavian sfigure of speech which is [call a spade a spade](https://en.wikipedia.org/wiki/Call_a_spade_a_spade). The is the reason this project is called Spaden.

[![travis status](https://api.travis-ci.org/finn-no/spaden.png)](https://travis-ci.org/finn-no/spaden)

[![NPM](https://nodei.co/npm/spaden.png?stars&downloads)](https://nodei.co/npm/spaden/)
[![NPM](https://nodei.co/npm-dl/spaden.png)](https://nodei.co/npm/spaden/)

## Building

	# Install dependencies
	$ npm install

	# Build artifacts
	$ npm run package

The built artifacts reside in the _/dist_ folder in the current directory.


## Releasing

When releasing you must specify how to bump the version number. Please consult the [semver standard](http://semver.org/) if you're not certain which to choose:

	$ npm version [patch | minor | major]
	$ ./node_modules/.bin/gulp
	$ npm publish .
	# Ensure the tags are pushed too
	$ git push --tags origin <branch name>

## Legacy browser support

	<!--[if IE 9 ]>
	<link rel="stylesheet" type="text/css" media="screen,projection,handheld"
	href="styles/so/ie9.css">
	<![endif]-->
	<!--[if IE 8 ]>
	<link rel="stylesheet" type="text/css" media="screen,projection,handheld"
	href="styles/so/ie8.css" />
	<![endif]-->
	<!--[if lte IE 8]>
	<link rel="stylesheet" type="text/css" media="screen,projection,handheld,print"
	href="styles/so/ie.css" />
	<![endif]-->

## Make print outs awesome

	<link rel="stylesheet" type="text/css" media="print"
	href="so/print.css">

## Contributing?

Check out our [contribution guidelines](contributing.md) for the most efficient way to contribute.
