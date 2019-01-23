// Dependencies
const Fs = require( 'fs' );
const Fsp = Fs.promises;
const ChildProc = require( 'child_process' );
const Treeify = require( 'treeify' );

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

/**
 * Spawn a child process and return the standard output.
 * 
 * @param {*} command - program to execute
 * @param {*} args - arguments for program
 */
const ExecuteProcess = ( command, args ) => {
	return new Promise( ( resolve, reject ) => {
		const proc = ChildProc.spawn( command, args )

		proc.stdout.on( 'data', ( data ) => {
			resolve( ( data.toString() ).trim() );
		})

		proc.stderr.on( 'data', ( data ) => {
			reject( data );
		});

		proc.on( 'close', ( code ) => {
			if ( code !== 0 ) {
				reject( code );
			}
		});
	} );
}

/**
 * Generate a dependency representation of a module inside an object by calling this function repeatedly
 * @thanks Dominik Wilkowski 💖
 */
const GetDepTree = async () => {
	let tree = {};
	let file = JSON.parse( await Fsp.readFile( `${components[ 0 ]}/package.json` ) );

	if( Object.keys( file.dependencies ).length > 0 ) {
		for( let module of Object.keys( file.dependencies ) ) {
			tree[ module ] = await GetDepTree( module );
		}
	}

	return tree
};

module.exports.IsDirectory = IsDirectory;
module.exports.GetFolders = GetFolders;
module.exports.ExecuteProcess = ExecuteProcess;
module.exports.GetDepTree = GetDepTree