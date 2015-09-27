# CSS Color Grab CLI
Small command line tool that extracts all uses of a single color from a CSS file.

# Installation
With [node.js](http://nodejs.org/) and [npm](http://github.com/isaacs/npm):

	npm install css-color-grab-cli

## Examples

Consider this simple CSS file called style.css:

	body {
		margin: 0;
		color: #585858;
		background-color: #ffffff;
		line-height: 1.5;
	}

	h1 {
		color: #585858;
		font-size: 3em;
		margin-bottom: 1.5em;
	}

	p {
		color: #585858;
	}

	.entry-meta {
		background-color: #ffffff;
	}

Run a command from the same directory

	css-color-grab 585858 style.css

And you'll get this in your terminal:

	body,
	h1,
	p
	{
	    color: #585858;
	}

Grabbing white color

	css-color-grab ffffff style.css

Will give you this:

	body,
	.entry-meta
	{
	    background-color: #fff;
	}

To save the output to a file:

	css-color-grab 585858 style.css dark.css

# Dependencies

* [PostCSS](https://www.npmjs.com/package/postcss)
* [CSScomb](https://www.npmjs.com/package/csscomb)
