import * as server from "./server";
import program from "commander";

program
	.version( "1.0.0" )
	.parse( process.argv );

function started () {
	console.info( "Service waiting for input..." );
}

function error ( err ) {
	console.error( "Service", err );
	throw err;
}
server.start()
	.then( started )
	.catch( error );
