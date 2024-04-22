import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import config from 'config';
import { router as loginRoute } from './routes/login'
import { router as stockRoute } from './routes/stock'
import cors from 'cors';

import bodyParser from 'body-parser'

const app = express()

const port: number = config.get('server.port');
const hostName: string = config.get('server.host')
const mongodbUsername: string = config.get('mongodb.username')
const mongodbPassword: string = config.get('mongodb.password')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(`mongodb+srv://${mongodbUsername}:${mongodbPassword}@nodebackenddb.fqdfijh.mongodb.net/NodeAPI?retryWrites=true&w=majority`).then((res) => {
    console.log('Connected to the DataBase! ')
    app.listen(port, hostName, () => {
        console.log(`Server is running on http://${hostName}:${port}`);
        app.use("/api/login", loginRoute);
        app.use("/api/stock", stockRoute);
        app.get('/', (req: Request, res: Response) => {
            res.send('hello world');
        });
    })
}).catch(() => {
    console.log('Cannot Connect to the server.')
})