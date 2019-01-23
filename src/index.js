// Dependencies
const Fs = require( 'fs' );
const Fsp = Fs.promises;
const Path = require( 'path' );
const JSDoc = require( 'jsdoc-to-markdown' );

// Local Dependencies
const { GetFolders, ExecuteProcess, GetDepTree } = require( './helpers' );
const Config = require( './config' );
const { Render, RenderExample } = require( './renderer' );


/**
 * 
 * @param {filePath} reactSource 
 */
const RenderReactDocs = async ( reactSource ) => {
	return await JSDoc.render( reactSource );
}

const GenerateDocPage = async () => {
	let components = await GetFolders( Config.componentPath );
	
	let markdown = await Fsp.readFile( `${components[ 0 ]}/doc/OVERVIEW.md`, 'utf-8' );
	
	// Append React component comments to OVERVIEW.md file
	markdown += await RenderReactDocs( { files: `${components[ 0 ]}/src/react/button.js` }, 'utf-8' );

	let html = Render( markdown );
	html +=	`<style>${ Config.prismTheme }</style>`

	Fsp.writeFile( `index.html`, html );
}


// Start thing
( async () => {
	// await GenerateDocPage();
	
	let components = await GetFolders( Config.componentPath );
	
	console.log( await GetDepTree( await Fsp.readFile( `${components[ 0 ]}/package.json` ) ) );
	let packageMeta = JSON.parse( await Fsp.readFile( `${components[ 0 ]}/package.json` ) );
	let packageNamePlain = packageMeta.name.split('/')[1]

	let readme = `${packageMeta.name}
	
---
${packageMeta.description}

## Install

\`\`\`bash
yarn add --dev ${packageMeta.name}
\`\`\`
\`\`\`bash
npm i -D ${packageMeta.name}
\`\`\`

## Usage
\`\`\`jsx
${ RenderExample( await Fsp.readFile( `${components[ 0 ]}/doc/OVERVIEW.md`, 'utf-8' ) ) }
\`\`\`

## Props
todo

## Dependency Graph
\`\`\`bash
${ await ExecuteProcess( 'npm', ['list', './components/button'] ) }
\`\`\`

## Test
https://auds.service.gov.au/packages/${packageNamePlain}/tests/site/
`
	await Fsp.writeFile( `${components[ 0 ]}/README-GEN.md`, readme )
})();

