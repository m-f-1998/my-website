import { Router } from "express"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"

dotenv.config ( { path: ".env" } )

const router = Router ( )

function connect ( ) {
  if ( !process.env.MONGO_URI || !process.env.MONGO_DB ) {
    throw Error ( "MongoDB URI or Database Name not provided." )
  }

  const client = new MongoClient ( process.env.MONGO_URI )
  return client.connect ( ).then ( ( ) => {
    return client.db ( process.env.MONGO_DB )
  } ).catch ( e => {
    console.error ( e )
    throw Error ( "Database Not Connected." )
  } )
}

// ! DEPRECATED: Legacy Router

router.get ( "/ordo-1962/v1.3/ordo.php" , ( req, res ) => {
  const year = Number ( req.query.year ) ?? new Date ( ).getFullYear ( )
  connect ( ).then ( db => {
    db.collection ( "OrdoV1.3" ).findOne (
      { "Year": year },
      { projection: { _id: 0 } }
    ).then ( ( data: any ) => {
      if ( !data ) {
        res.status ( 404 ).send ( "No data stored for the specified year." )
      } else {
        res.send ( data )
      }
    } ).catch ( e => { res.status ( 500 ).send ( e ) } )
  } )
} )

router.get ( "/ordo-1962/v1.3/prayers.php" , ( req, res ) => {
  connect ( ).then ( db => {
    db.collection ( "PrayersV1.3" ).findOne (
      {},
      { projection: { _id: 0 } }
    ).then ( ( data: any ) => {
      if ( !data ) {
        res.status ( 404 ).send ( "No data stored for the specified year." )
      } else {
        res.send ( data )
      }
    } )
  } ).catch ( e => { res.status ( 500 ).send ( e ) } )
} )

router.get ( "/ordo-1962/v1.3/locale.php" , ( req, res ) => {
  connect ( ).then ( db => {
    db.collection ( "LocaleV1.3" ).findOne (
      { },
      { projection: { _id: 0 } }
    ).then ( ( data: any ) => {
      if ( !data ) {
        res.status ( 404 ).send ( "No data stored for the specified year." )
      } else {
        res.send ( data )
      }
    } ).catch ( e => { res.status ( 500 ).send ( e ) } )
  } )
} )

export default router