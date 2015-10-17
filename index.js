#! /usr/bin/env node

// Dependencies.
var fs      = require( 'fs' );
var postcss = require( 'postcss' );
var Comb    = require( 'csscomb' );
var comb    = new Comb( 'csscomb' );

// Process user arguments.
var userArgs   = process.argv.slice( 2 );
var color      = userArgs[0];
var inputFile  = userArgs[1];
var outputFile = userArgs[2];

// List of properties that define color.
var properties = {
	'color': {},
	'background': {},
	'background-color': {},
	'background-image': {},
	'border': {},
	'border-top': {},
	'border-right': {},
	'border-bottom': {},
	'border-left': {},
	'border-color': {},
	'border-top-color': {},
	'border-right-color': {},
	'border-bottom-color': {},
	'border-left-color': {},
	'outline': {},
	'outline-color': {},
	'text-shadow': {},
	'box-shadow': {},
};

/**
 * Checks if property allows color.
 * @param  {string} prop The name of the property.
 * @return {bool}
 */
function propAllowColor( prop ) {
	return properties.hasOwnProperty( prop );
}

/**
 * Checks if given property value has given color.
 * @param  {string} color The name of the property.
 * @param  {string} value Property value that potentially has needed color.
 * @return {bool}
 */
function valueHasColor( value, color ) {
	return value.indexOf( color ) > -1;
}

/**
 * Process the CSS.
 * @param  {string} data The CSS we are working with.
 * @return {string}      The CSS that contain only specified color.
 */
function processInput( data ) {
	// Parse the css.
	var css = postcss.parse( data, { from: inputFile } );

	// Define empty.
	var outputCss = '';

	/*
	 * Walk through each declaration, check if property allow color
	 * and if the color is the one we are looking for.
	 * If yes, add a property and selector to the 'properties' object.
	 * If property is already present in the object, just add the selector.
	 */
	postcss.parse( css ).walkDecls( function ( decl ) {
		if ( propAllowColor( decl.prop ) && valueHasColor( decl.value, color ) ) {

			if ( decl.prop == 'border' ) {

				if ( ! properties[ 'border-color' ].hasOwnProperty( 'selectors' ) ) {
					properties[ 'border-color' ].selectors = [];
				}

				if ( ! properties[ 'border-color' ].hasOwnProperty( 'value' ) ) {
					properties[ 'border-color' ].value = '';
				}

				properties[ 'border-color' ].selectors.push( decl.parent.selector );
				properties[ 'border-color' ].value = '#' + color;

			} else if ( decl.prop == 'border-top' ) {

				if ( ! properties[ 'border-top-color' ].hasOwnProperty( 'selectors' ) ) {
					properties[ 'border-top-color' ].selectors = [];
				}

				if ( ! properties[ 'border-top-color' ].hasOwnProperty( 'value' ) ) {
					properties[ 'border-top-color' ].value = '';
				}

				properties[ 'border-top-color' ].selectors.push( decl.parent.selector );
				properties[ 'border-top-color' ].value = '#' + color;

			} else if ( decl.prop == 'border-right' ) {

				if ( ! properties[ 'border-right-color' ].hasOwnProperty( 'selectors' ) ) {
					properties[ 'border-right-color' ].selectors = [];
				}

				if ( ! properties[ 'border-right-color' ].hasOwnProperty( 'value' ) ) {
					properties[ 'border-right-color' ].value = '';
				}

				properties[ 'border-right-color' ].selectors.push( decl.parent.selector );
				properties[ 'border-right-color' ].value = '#' + color;

			} else if ( decl.prop == 'border-bottom' ) {

				if ( ! properties[ 'border-bottom-color' ].hasOwnProperty( 'selectors' ) ) {
					properties[ 'border-bottom-color' ].selectors = [];
				}

				if ( ! properties[ 'border-bottom-color' ].hasOwnProperty( 'value' ) ) {
					properties[ 'border-bottom-color' ].value = '';
				}

				properties[ 'border-bottom-color' ].selectors.push( decl.parent.selector );
				properties[ 'border-bottom-color' ].value = '#' + color;

			} else if ( decl.prop == 'border-left' ) {

				if ( ! properties[ 'border-left-color' ].hasOwnProperty( 'selectors' ) ) {
					properties[ 'border-left-color' ].selectors = [];
				}

				if ( ! properties[ 'border-left-color' ].hasOwnProperty( 'value' ) ) {
					properties[ 'border-left-color' ].value = '';
				}

				properties[ 'border-left-color' ].selectors.push( decl.parent.selector );
				properties[ 'border-left-color' ].value = '#' + color;

			} else if ( decl.prop == 'outline' ) {

				if ( ! properties[ 'outline-color' ].hasOwnProperty( 'selectors' ) ) {
					properties[ 'outline-color' ].selectors = [];
				}

				if ( ! properties[ 'outline-color' ].hasOwnProperty( 'value' ) ) {
					properties[ 'outline-color' ].value = '';
				}

				properties[ 'outline-color' ].selectors.push( decl.parent.selector );
				properties[ 'outline-color' ].value = '#' + color;

			} else {

				if ( ! properties[ decl.prop ].hasOwnProperty( 'selectors' ) ) {
					properties[ decl.prop ].selectors = [];
				}

				if ( ! properties[ decl.prop ].hasOwnProperty( 'value' ) ) {
					properties[ decl.prop ].value = '';
				}

				properties[ decl.prop ].selectors.push( decl.parent.selector );
				properties[ decl.prop ].value = decl.value;
			}

		}

	} );

	// Build the CSS.
	for ( var k in properties ) {
		if ( properties.hasOwnProperty( k ) ) {
			if ( properties[k].hasOwnProperty( 'selectors' ) && properties[k].hasOwnProperty( 'value' ) ) {
				outputCss += properties[k].selectors.join() + ' { ' + k + ': ' + properties[k].value + ' }\n\n';
			}
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
