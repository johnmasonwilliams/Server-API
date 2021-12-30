import express, { Request, Response, NextFunction } from 'express';
export const app = express();

import { lib } from '.';

// import { auth } from './firebase';

import cors from 'cors';


////// MIDDLEWARE  //////

// Allows cross origin requests
app.use(cors({ origin: true }));

// Sets rawBody for webhook handling
app.use(
  express.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
  })
);

// // Decodes the Firebase JSON Web Token
// app.use(decodeJWT);

// /**
//  * Decodes the JSON Web Token sent via the frontend app
//  * Makes the currentUser (firebase) data available on the body.
//  */
// async function decodeJWT(req: Request, res: Response, next: NextFunction) {
//   if (req.headers?.authorization?.startsWith('Bearer ')) {
//     const idToken = req.headers.authorization.split('Bearer ')[1];

//     try {
//       const decodedToken = await auth.verifyIdToken(idToken);
//       req['currentUser'] = decodedToken;
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   next();
// }


///// HELPERS /////

/**
 * Validate the stripe webhook secret, then call the handler for the event type
 */
function runAsync(callback: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
}


///// MAIN API /////

/**
 * Get Player Match List
 */
 app.get(
  '/match-list', 
  runAsync(async ({ body }: Request, res: Response) => {
  
    const result = await 
    lib.halo.infinite[process.env.API_VERSION].stats.matches.list({
      gamertag: body.gamertag, // required
      limit: {
        'count': body.match_count, // 1-25
        'offset': body.match_offset
      },
      mode: body.match_mode // matchmade, custom
    });

    res.status(200).send( result );
  }
));

/**
 * Get Player Match Details
 */
app.get(
  '/match-details', 
  runAsync(async ({ body }: Request, res: Response) => {
  
    const result = await 
    lib.halo.infinite[process.env.API_VERSION].stats.matches.retrieve({
      id: body.match_id // required
    });

  res.status(200).send( result );
  }
));

/**
 * Get Available Medals
 */
 app.get(
  '/medals', 
  runAsync(async ({ body }: Request, res: Response) => {
  
    const result = await 
    lib.halo.infinite[process.env.API_VERSION].metadata.medals.list();

  res.status(200).send( result );
  }
));

/**
 * Get Player Appearance
 */
 app.get(
  '/player-appearance', 
  runAsync(async ({ body }: Request, res: Response) => {
  
    const result = await lib.halo.infinite['@0.3.3'].appearance({
      gamertag: body.gamertag
    });

    res.status(200).send( result );
  }
));

/**
 * Get Player Campaign Service Record
 */
 app.get(
  '/player-campaign-service-record', 
  runAsync(async ({ body }: Request, res: Response) => {
  
    const result = await 
    lib.halo.infinite[process.env.API_VERSION].stats['service-record'].campaign({
        gamertag: body.gamertag,
    });

    res.status(200).send( result );
  }
));

/**
 * Get Player Multiplayer Service Record
 */
app.get(
    '/player-multiplayer-service-record', 
    runAsync(async ({ body }: Request, res: Response) => {
    
      const result = await 
      lib.halo.infinite[process.env.API_VERSION].stats['service-record'].multiplayer({
          gamertag: body.gamertag,
          filter: body.filter // matchmade:pvp, matchmade:social, matchmade:ranked, matchmade:bots, custom
      });

    res.status(200).send( result );
  }
));

/**
 * Get Player CSRs
 */
 app.get(
  '/player-csrs', 
  runAsync(async ({ body }: Request, res: Response) => {
  
    const result = await 
    lib.halo.infinite[process.env.API_VERSION].stats.csrs({
      gamertag: body.gamertag,
      season: body.season // 1
    });

    res.status(200).send( result );
  }
));