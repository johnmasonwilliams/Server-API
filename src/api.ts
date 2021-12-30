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

// Decodes the Firebase JSON Web Token
app.use(decodeJWT);

/**
 * Decodes the JSON Web Token sent via the frontend app
 * Makes the currentUser (firebase) data available on the body.
 */
 async function decodeJWT(req: Request, res: Response, next: NextFunction) {
    if (req.headers?.authorization?.startsWith('Bearer ')) {
      const idToken = req.headers.authorization.split('Bearer ')[1];
  
      try {
        const decodedToken = await auth.verifyIdToken(idToken);
        req['currentUser'] = decodedToken;
      } catch (err) {
        console.log(err);
      }
    }
  
    next();
  }

///// MAIN API /////

app.get(
    '/test', 
    runAsync(async ({ body }: Request, res: Response) => {
    
    const result = await lib.halo.infinite[process.env.API_VERSION].stats['service-record'].multiplayer({
        gamertag: body.gamertag,
        filter: body.filter
    });

  res.status(200).send( result );
}));

///// HELPERS /////

/**
 * Validate the stripe webhook secret, then call the handler for the event type
 */
 function runAsync(callback: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
      callback(req, res, next).catch(next);
    };
  }