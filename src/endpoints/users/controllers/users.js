import Promise from "bluebird";
import NeDB from "nedb";

let db = new NeDB( {filename: "users.db", autoload: true} );

export default {

	get( request/*, response*/ ) {
		return new Promise( ( resolve, reject ) => {
			let userName = request.params.user;
			db.find( {name: userName} ).exec( function ( err, docs ) {
				if ( err ) {
					reject( {
						status: 500,
						message: err
					} );
				}
				if ( docs.length === 0 ) {
					reject( {
						status: 404,
						message: `User with name ${request.params.user} could not be found`
					} );
				}
				resolve( docs );
			} );
		} );
	},

	add( request/*, response*/ ) {
		return new Promise( ( resolve, reject ) => {
			if ( !request.body || !request.body.name ) {
				reject( {
					status: 400,
					message: "Bad request!"
				} );
			}
			db.find( {name: request.body.name} ).exec( function ( err, docs ) {
				if ( docs.length > 0 ) {
					resolve( {
						status: 409,
						message: `User with name ${request.body.name} already exists`
					} );
				} else {
					db.insert( request.body, function ( err, doc ) {
						console.log( "Inserted", JSON.stringify( doc ), "with ID", doc._id );
						if ( err ) {
							reject( {
								status: 500,
								message: err
							} );
						}
						resolve( {
							status: 200,
							message: `Users with name ${request.body.name} has been successfully created`
						} );
					} );
				}
			} );
		} );
	},
	del( request/*, response*/ ){
		return new Promise( ( resolve, reject ) => {
			db.remove( {name: request.params.user}, {multi: true}, function ( err, nbrOfRemoves ) {
				if ( err ) {
					reject( {
						status: 500,
						message: err
					} );
				}
				if ( nbrOfRemoves > 0 ) {
					resolve( {
						status: 200,
						message: `Users with name ${request.params.user} has been successfully deleted`
					} );
				} else {
					reject( {
						status: 404,
						message: `Users with name ${request.params.user} could not be found`
					} );
				}
			} );
		} );
	},

	getList(){
		return new Promise( ( resolve ) => {
			db.find( {} ).exec( function ( err, docs ) {
				resolve( docs )
			} );
		} );
	}

};
