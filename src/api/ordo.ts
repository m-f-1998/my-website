import { Router } from "express"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"

dotenv.config ( { path: ".env" } )

const router = Router ( )

interface Locale {
  [ month: string ]: {
    [ day: string ]: [ {
      title: string,
      colors: string,
      rank: number,
      options: string,
      propers: Array<any>,
      commemorations: Array<any>,
      diocese: string
    } ]
  }
}

router.get ( "/ordo/:year", ( req, res ) => {
  const year = req.params.year
  const country = req.query.country || null

  connect ( ).then ( db => {
    db.collection ( "Universal" ).findOne (
      { "year": year.toString ( ) },
      { projection: { _id: 0 } }
    ).then ( data => {
      if ( !data ) {
        res.status ( 404 ).send ( "No data stored for the specified year." )
      } else {
        const result = data
        if ( country ) {
          db.collection ( "Locale" ).findOne (
            { "country": country },
            { projection: { _id: 0, country: 0 } }
          ).then ( data => {
            if ( data ) {
              const locale = data as Locale
              for ( const month in locale ) {
                for ( const day in locale [ month ] ) {
                  const celebrations = locale [ month ] [ day ].filter ( celebration =>
                    celebration.diocese === req.query.diocese || celebration.diocese === "All Dioceses"
                  )
                  result [ month ] [ day ].celebrations = ( result [ month ] [ day ]?.celebrations || [ ] ).concat ( celebrations )
                }
              }
            }
            res.send ( result )
          } )
        } else {
          res.send ( result )
        }
      }
    } )
  } ).catch ( e => { res.status ( 500 ).send ( e ) } )
} )

router.get ( "/prayers", ( req, res ) => {
  connect ( ).then ( db => {
    db.collection ( "Prayers" ).find (
      req.query.language ? { "language": req.query.language } : { },
      { projection: { _id: 0 } }
    ).toArray ( ).then ( prayers => {
      res.send ( prayers )
    } )
  } ).catch ( e => { res.status ( 500 ).send ( e ) } )
} )

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

export default router