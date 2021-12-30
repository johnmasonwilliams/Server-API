// Environment Variables (Stripe API Key)
import { config } from "dotenv"
if (process.env.NODE_ENV !== 'production') {
    config();
}

// Initialize lib
export const lib = require('lib')({token: process.env.API_KEY});


// Start the API with Express
import { app, } from './api';
const port = process.env.PORT || 3333;
app.listen(port, () => console.log(`API available on http://localhost:${port}`));