import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import 'reflect-metadata';

import createConnection from './database';
import { ErrorManager } from './errors/ErrorManager';
import { router } from './routes';

createConnection();
const app = express();

app.use(express.json());
app.use(router);

app.use((err: Error, request: Request, response: Response, _next: NextFunction)=>{
    if(err instanceof ErrorManager){
        return response.status(err.status).json({message: err.message})
    }

    return response.status(500).json({
        status: "Error",
        message: `Seems like an Internal server error ${err.message}`
    })
})

export {app};
