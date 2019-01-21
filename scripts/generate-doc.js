// Dependencies
const Fs = require( 'fs' );
const Path = require( 'path' );
const Fsp = Fs.promises;
const Marked = require( 'marked' );
const ReactDOMServer = require( 'react-dom/server' );
const Babel = require( '@babel/core' );
const Prism = require( 'prismjs' );
const PrismLanguage = require( 'prismjs/components/');
const JSDoc = require( 'jsdoc-to-markdown' );
const Sassdoc = require( 'sassdoc' );

// Set up marked renderer
const MarkdownRenderer = new Marked.Renderer();

MarkdownRenderer.code = ( code, language ) => {
	if( language.includes( 'example' ) ){

		const babelComponent = Babel.transform( code, {
			presets: [ '@babel/preset-react', '@babel/preset-env' ],
		}).code;
		
		const Component = eval( babelComponent );
		const HTML = ReactDOMServer.renderToStaticMarkup( Component );

		// Split components on newline
		const HTMLComponents = HTML.split( /\n/ );

		let HTMLOutput = "";
		const PrismCSS = Fs.readFileSync( Path.join( __dirname, '/../node_modules/prismjs/themes/prism-dark.css' ), 'utf-8' );

		//Enable JSX Prism.js language 
		PrismLanguage(['jsx']);

		HTMLComponents.forEach( item => {
			HTMLOutput += `<style>${ PrismCSS }</style><div class="code-example-react">${ Prism.highlight( code, Prism.languages.jsx, 'jsx') }</div><br/>
			<div id="code-example-html">${ Prism.highlight( item, Prism.languages.javascript, 'javascript') }</div><br/>
			<div class="">${ HTML }</div>`
		});
		
		return HTMLOutput;
	}
	else {
		return `<code>${ code }</code>`;
	}
}


// SETTINGS
const componentFolder = Path.join( __dirname, `/../components` );


/**
 * IsDirectory - Check if a location is a file or a directory
 *
 * @param {string} source - The location of the file
 */
const IsDirectory = ( source ) => {
	return Fs.lstatSync( source ).isDirectory();
}


/**
 * GetFolder - Gets all the folders inside a location
 *
 * @param {*} folderLocation - The location of the folder to get folders from
 */
const GetFolders = async ( folderLocation ) => {	
	// Get the contents inside the folder
	const folderContents = await Fsp.readdir( folderLocation, { withFileTypes: true } );
	
	// Filter the contents and return only directories
	return folderContents.map( source => `${ folderLocation }/${ source.name }` ).filter( IsDirectory );
}


// Start thing
( async () => {
	const components = await GetFolders( componentFolder );
	
	//@TODO Just read the components/button OVERVIEW.md for now
	let markdown = await Fsp.readFile( `${components[ 0 ]}/doc/OVERVIEW.md`, { encoding: 'utf-8' } );

	// Append React component comments to OVERVIEW.md file
	markdown += await JSDoc.render( { files: `${ components[ 0 ] }/src/react/button.js`,  } );

	// console.log( await Sassdoc.parse( `${ components[ 1 ] }/src/sass` ), { verbose: true } );

	const html = Marked( markdown, { renderer: MarkdownRenderer } );
	
	Fsp.writeFile( `index.html`, html );
})();

