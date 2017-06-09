/**
 * Defines all REST methods for the '/extensions' endpoints
 * @owner Håkan Hallström (hhm).
 */

import responseHandler from "../response-handler";

export const route = "/users";

export function register ( router ) {

	const controller = require( "./controllers/users" ).default;

	router.use( ( req, res, next ) => {
		next();
	} );

	router.get( "/", responseHandler.process( controller.getList ) );
	router.get( "/:user", responseHandler.process( controller.get ) );
	router.post( "/add", responseHandler.process( controller.add ) );
	router.delete( "/:user", responseHandler.process( controller.del ) );

}
