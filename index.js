#! /usr/bin/env node

// Dependencies.
var fs      = require( 'fs' );
var postcss = require( 'postcss' );
var Comb    = require( 'csscomb' );
var comb    = new Comb( 'csscomb' );

// Process user arguments.
var userArgs   = process.argv.slice(2);
var color      = userArgs[0];
var inputFile  = userArgs[1];
var outputFile = userArgs[2];

// List of properties that define color.
var properties = [
	'color',
	'background',
	'background-color',
	'background-image',
	'border',
	'border-top',
	'border-right',
	'border-bottom',
	'border-left',
	'border-color',
	'border-top-color',
	'border-right-color',
	'border-bottom-color',
	'border-left-color',
	'outline',
	'outline-color',
	'text-shadow',
	'box-shadow'
];

/**
 * Checks if property allows color.
 * @param  {string} prop The name of the property.
 * @return {bool}        
 */
function propAllowColor( prop ) {
	return properties.indexOf( prop ) > -1;
}

/**
 * Process the CSS.
 * @param  {string} data The CSS we are working with.
 * @return {string}      The CSS that contain only specified color.
 */
function processInput( data ) {
	// Parse the css.
	var css = postcss.parse( data, { from: inputFile } );
	
	// Define empty 
	var outputCss = ''

	// Object containing the list of color properties and selectors.
	var selectors = {};

	/*
	 * Walk through each declaration, check if property allow color
	 * and if the color is the one we are looking for.
	 * If yes, add a property and selector to the 'selectors' object.
	 * If property is already present in the object, just add the selector.
	 */
	postcss.parse( css ).walkDecls( function ( decl ) {
		if ( propAllowColor( decl.prop ) && decl.value == ('#' + color ) ) {
			if ( ! selectors.hasOwnProperty( decl.prop ) ) {
				selectors[ decl.prop ] = [];
			}
			selectors[ decl.prop ].push( decl.parent.selector );
		}
	} );

	// Build the CSS.
	for ( var prop in selectors ) {
		if ( selectors.hasOwnProperty( prop ) ) {
			outputCss += selectors[prop].join() + ' { ' + prop + ': #' + color + ' }\n\n';
		}
	}

	// If we have CSS, prettify it and write to the output file.
	if ( outputCss ) {
		outputCss = comb.processString( outputCss );
		if ( outputFile ) {
			fs.writeFileSync( outputFile, outputCss );
			console.log( 'All done!' );
		} else {
			console.log( outputCss )
		}
	}
}

/**
 * Process the input file.
 */
function processInputFile() {
	// Check if user specified the color.
	if ( ! color ) {
		throw new Error( 'You need to specify the color to look for' );
	}

	// Check if user specified the input file.
	if ( ! inputFile ) {
		throw new Error( 'No input file specified.' );
	}

	// Try to read the file and do the rest of the magic.
	fs.readFile( inputFile, 'utf8', function ( err, data ) {
		if ( err ) {
			throw new Error( 'No file named ' + inputFile + ' found in the directory!' );
		}
		processInput( data );
	} );
}

// Unleash the beast.
processInputFile();
