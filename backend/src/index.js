import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import collectData from './collectData';
import getWeather from './getWeather';
import getPhotos from './getPhotos';

const app = express();
app.use(cors());
app.use(morgan('combined'));

const port = process.env.PORT || 3002;

/* GET index page. */
app.get('/', (req, res) => {
    res.json({testkey: 'testvalue'});
});

app.get('/location', async (req, res, next) => {

    let responses = await collectData(req, next);

    const weather = responses[0];
    const photos = responses[1];

    res.json({
        weather,
        photos
    });
 
});

app.get('/location/weather', async(req, res, next) => {

    try {
        const latlon = {lat: req.query.lat, lon: req.query.lon};

        const weather = await getWeather(latlon);

        res.json(weather);

    } catch(error) {
        next(error);
    }

});

app.get('/location/photos', (req, res, next) => {

    const latlon = {lat: req.query.lat, lon: req.query.lon};
    const size = req.query.size;
    const count = req.query.count ? req.query.count : 1;
    const page = req.query.page ? req.query.page : 1;

    getPhotos(latlon, size, count, page).then((photos) => {

        res.json(photos);

    }, next);

});

app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!');
});

/**
 * Example error:
 *
 * {
 *     "stack": "Error: Weather: Nothing to geocode",
 *     "statusCode": 400,
 *     "error": "Bad Request",
 *     "message": "Weather: Nothing to geocode"
 * }
 */
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.output) {
        res.status(err.output.statusCode).json(Object.assign({ stack: err.stack }, err.output.payload));
    } else {
        res.status(500).json({
            statusCode: 500,
            stack: err.stack,
            error: "Internal server error",
            message: err.message
        });
    }
});
