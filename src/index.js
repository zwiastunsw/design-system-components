// Dependencies
const Fs = require( 'fs' );
const Fsp = Fs.promises;
const Marked = require( 'marked' );
const ReactDOMServer = require( 'react-dom/server' );
const Babel = require( '@babel/core' );
const Prism = require( 'prismjs' );
const PrismLanguage = require( 'prismjs/components/');
const JSDoc = require( 'jsdoc-to-markdown' );

// Local Dependencies
const Helpers = require( './helpers' );
const Config = require( './config' );



/**
 * Transform ES6 or JSX into CommonJS.
 * @param {string} code - Code to transpile
 * 
 * @returns {string} - CommonJS string output
 */
const TransformCode = ( code ) => {
	return Babel.transform( code, {
		presets: [ '@babel/preset-react', '@babel/preset-env' ],
	}).code;
}



/**
 * 
 * @param {string} html 
 * @param {string} react 
 */
const FormatHTML = ( html, react ) => {
	PrismLanguage( [ 'jsx' ] );

	let HTMLOutput = "";

	HTMLOutput += `<div class="code-example-html">${ Prism.highlight( html, Prism.languages.html, 'html') }</div><br/>`
	HTMLOutput += `<div class="code-example-react">${ Prism.highlight( react, Prism.languages.jsx, 'jsx') }</div><br/>`
	HTMLOutput += `${ html }`
	
	return HTMLOutput;
}



/**
 * 
 * @param {string} react 
 */
const RenderHTML = ( react ) => {
	// Parse React code to commonJS
	let commonJS = TransformCode( react );
	// Extract HTML from common react code
	let html = ReactDOMServer.renderToStaticMarkup( eval( commonJS ) );
	// Add styling and escaping to HTML
	return FormatHTML( html, react );
}



/**
 * 
 * @param {filePath} reactSource 
 */
const RenderReactDocs = async ( reactSource ) => {
	return await JSDoc.render( reactSource );
}



// Start thing
( async () => {
	const MarkdownRenderer = new Marked.Renderer();

	let components = await Helpers.GetFolders( Config.componentPath );
	let markdown = await Fsp.readFile( `${components[ 0 ]}/doc/OVERVIEW.md`, { encoding: 'utf-8' } );

	// @TODO Just read the components/button OVERVIEW.md for now
	MarkdownRenderer.code = ( code, token ) => {
		if( token.includes( 'example' ) ){
			return RenderHTML( code )
		}
		else {
			return `<code>${ code }</code>`;
		}
	}

	// Append React component comments to OVERVIEW.md file
	markdown += await RenderReactDocs( { files: `${components[ 0 ]}/src/react/button.js` }, { encoding: 'utf-8' } );

	let html = Marked( markdown, { renderer: MarkdownRenderer } );

	html +=	`<style>${ Config.prismTheme }</style>`

	Fsp.writeFile( `index.html`, html );
})();

