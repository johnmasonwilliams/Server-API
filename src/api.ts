import express, { Request, Response, NextFunction } from 'express';
import { lib } from '.';
import { auth } from './firebase';
export const app = express();

// Allows cross origin requests
import cors from 'cors';

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

app.get(
    '/player-service-record', 
    runAsync(async ({ body }: Request, res: Response) => {
    
    const result = await 
    lib.halo.infinite[process.env.API_VERSION].stats['service-record'].multiplayer({
        gamertag: body.gamertag,
        filter: body.filter
    });

  res.status(200).send( result );
}));

app.get(
  '/player-csrs', 
  runAsync(async ({ body }: Request, res: Response) => {
  
  const result = await 
  lib.halo.infinite[process.env.API_VERSION].stats.csrs({
    gamertag: body.gamertag,
    season: body.season
  });

res.status(200).send( result );
}));

app.get(
  '/match-list', 
  runAsync(async ({ body }: Request, res: Response) => {
  
  const result = await 
  lib.halo.infinite[process.env.API_VERSION].stats.matches.list({
    gamertag: body.gamertag, // required
    limit: {
      'count': body.match_count,
      'offset': body.match_offset
    },
    mode: body.match_mode
  });

res.status(200).send( result );
}));

app.get(
  '/match-info', 
  runAsync(async ({ body }: Request, res: Response) => {
  
  const result = await 
  lib.halo.infinite[process.env.API_VERSION].stats.matches.retrieve({
    id: body.match_id // required
  });

res.status(200).send( result );
}));