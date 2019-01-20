import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import getWeather from './getWeather';

const app = express();
app.use(cors());
app.use(morgan('combined'));

const port = 3002;

/* GET index page. */
app.get('/', (req, res) => {
    res.json({testkey: 'testvalue'});
});

app.get('/location', (req, res, next) => {

    getWeather({lat: req.query.lat, lon: req.query.lon}, (weather) => {

        res.json({
            weather
        });

    }, next);
 
});

app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!');
});

/**
 * Sample error:
 * 
 * {
 *     "statusCode": 404,
 *     "payload": {
 *         "statusCode": 404,
 *         "error": "Not Found",
 *         "message": "Internal error"
 *     },
 *     "headers": {}
 * }
 */
app.use((err, req, res, next) => {
    console.log("ERROR HANDLER --------");
    console.log(err);
    res.status(err.output.statusCode).json(err.output);
});
