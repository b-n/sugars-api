import express from 'express'
import cowsay from 'cowsay'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

import * as util from './src/server-util'
import db from './models/index'
import route from './routes/index'

export function run() {
    //get environment variables
    dotenv.load();

    let app = express();
    let database = new db();
    let routes = new route(database, express);
    
    database.setupDb();    

    app.use(util.enableCORS);
    app.use(bodyParser.json());
    
    app.use(routes.getRoutes());
 
    app.set('port', (process.env.PORT || 5000));

    app.listen(app.get('port'), function() {
        console.log('Up and running on all cylinders');
        console.log(cowsay.say({ text: 'mooooooo'}));
    });

}
