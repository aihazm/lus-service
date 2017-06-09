/**
 * Sends a response
 *
 * @param {Object} res The response object
 * @param {Object} result The result
 */
function sendResponse ( res, result ) {
	res.set( "Cache-Control", "no-store" ); // Dynamic response, stop any caching.

	if ( result.headers ) {
		res.set( result.headers );
	}
	res.status( result.status || 200 ).send( result.body || result );
}

/**
 * Sends an error response
 *
 * @param {Object} res The response object
 * @param {Object} error The error result
 */
function sendErrorResponse ( res, error ) {
	if ( typeof error.message === "string" ) {
		error.body = error.message;
	}
	console.error( "Error" + ": " + (error.body || error) );
	res.status( error.status || 500 ).send( error.body || "Internal error; check logs" );
}

export default {
	/**
	 * Usage:
	 * router.<REST-METHOD>( path, responseHandler.process( controller.<CONTROLLER_OPERATION> ) );
	 * Example:
	 * router.post( "/", responseHandler.process( controller.scan ) );
	 *
	 * The response-handler catches both <thrown> and <reject>:ed errors. If error is an object containing
	 * property <status>, it will be set in the HTTP-reply; otherwise it will be treated as an uncontrolled
	 * error and thus default to 500. Property <header>, if present, of the same object will always be respected
	 * and set in the HTTP-reply. The reply will be either property <body>, if present, or the whole error,
	 * if it is a string. If neither are true, the reply is going to be empty (besides the optional
	 * <status>- and <header>-properties).
	 *
	 * @param controllerOperation The function to be called when the server gets a HTTP-call
	 * @returns {function(*=, *=)} A function that handles request- and response-objects of a HTTP-call.
	 * This is what is consumed by router-REST-function (see usage above).
	 */
	process( controllerOperation ) {
		return ( req, res ) => {
			try {
				let possiblePromise = controllerOperation( req, res );
				if ( typeof possiblePromise.then !== "function" ) {
					sendResponse( res, possiblePromise );
				} else {
					possiblePromise.then( result => {
						sendResponse( res, result );
					} ).catch( error => {
						sendErrorResponse( res, error );
					} );
				}
			} catch ( error ) {
				sendErrorResponse( res, error );
			}
		};
	}
};
