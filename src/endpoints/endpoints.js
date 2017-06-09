import * as add from "./users/index";
import Promise from "bluebird";

let endpoints = {add};

export function registerEndpoints ( express, app, config ) {
	return new Promise( ( resolve, reject ) => {
		let allEndpoints = [];
		for ( let endpoint in endpoints ) {
			try {
				let router = express.Router(); //eslint-disable-line new-cap
				endpoints[endpoint].register( router, config );
				app.use( endpoints[endpoint].route, router );
				console.info( `endpoint succesfully to loaded, ${endpoints[endpoint].route}` );
				allEndpoints.push( endpoints[endpoint].route );
			} catch ( e ) {
				console.warn( `endpoint about failed to load, ${e}` );
				return reject( e );
			}
		}
		return resolve( allEndpoints );
	} );
}
