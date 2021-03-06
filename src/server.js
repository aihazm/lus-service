import express from "express";
import http from "http";
import https from "https";
import bodyParser from "body-parser";
import {registerEndpoints} from "./endpoints/endpoints";
import Promise from "bluebird";

const config = {
	port: 7979,
	secure: false
};


function setupMiddleware ( app ) {
	app.use( bodyParser.json( {type: "application/json"} ) );

	app.use( function ( error, req, res, next ) {
		if ( error instanceof Error ) {
			console.error( `${error} ${error.body} calling ${req.url} method: ${req.method}` );
			res.sendStatus( error.statusCode );
		} else {
			next();
		}
	} );

	app.use(function (req, res, next) {
		// Website you wish to allow to connect
		res.setHeader('Access-Control-Allow-Origin', '*');

		// Request methods you wish to allow
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

		// Request headers you wish to allow
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

		// Set to true if you need the website to include cookies in the requests sent
		// to the API (e.g. in case you use sessions)
		res.setHeader('Access-Control-Allow-Credentials', true);

		// Pass to next layer of middleware
		next();
	});
}

export function start () {
	const app = express();

	setupMiddleware( app );

	function createServer () {
		return http.createServer( app );
	}

	function startServer ( server ) {
		return new Promise( ( resolve, reject ) => {
			const serviceIp = "::";
			server.listen( config.port, serviceIp, () => {
				const protocol = config.secure ? "https" : "http";
				console.info( `Web Extension Service listening on: ${protocol}://${serviceIp}:${config.port}` );
				resolve();
			} );

			server.on( "error", function ( error ) {
				reject( error );
			} );
		} );
	}

	return registerEndpoints( express, app, config )
		.then( createServer )
		.then( startServer )
		.catch( error => {
			console.error( "Fatal error when starting the service ", error );
		} );
}

process.on( "uncaughtException", ( err ) => {
	console.error( `Caught unhandled exception: ${err}` );
	process.exit( -1 ); // eslint-disable-line no-process-exit
} );

process.on( "unhandledRejection", ( reason, promise ) => {
	console.warn( "Unhandled Rejection at: Promise ", promise, " reason: ", reason );
	process.exit( -1 ); // eslint-disable-line no-process-exit
} );
