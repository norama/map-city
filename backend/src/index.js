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
app.get('/', (req: $Request, res: $Response) => {
    res.json({testkey: 'testvalue'});
});

/*
 * Weather and photos around location.
 *
 * Parameters:
 * lat, lon: location on map
 * size: photo size code (default: 's', see https://www.flickr.com/services/api/misc.urls.html)
 * photosCount: number of requested photos (default: 1)
 * 
 * Returns:
   {
       weather, // see endpoint /location/weather below
       photos   // see endpoint /location/photos below
   }
 */
app.get('/location', async (req: $Request, res: $Response, next: NextFunction) => {

    let responses: any = await collectData(req, next);

    const weather = responses[0];
    const photos = responses[1];

    res.json({
        weather,
        photos
    });
 
});

/*
 * Weather
 *
 * Parameters:
 * lat, lon: location on map
 * 
 * Returns: 
    {
        latlon: {lat, lon},
        name, // location name
        country, // country code
        weather: {
            summary,
            description,
            icon, // weather pictogram url
            wind: {speed, direction}, // speed: m/s, direction: degrees
            humidity,
            pressure, // hPa
            temperature // degrees celsius
        }
    }
 */
app.get('/location/weather', async(req: $Request, res: $Response, next: NextFunction) => {

    try {
        const latlon = {lat: req.query.lat, lon: req.query.lon};

        const weather = await getWeather(latlon);

        res.json(weather);

    } catch(error) {
        next(error);
    }

});

/*
 * Photos
 *
 * Parameters:
 * lat, lon: location on map
 * size: photo size code (default: 's', see https://www.flickr.com/services/api/misc.urls.html)
 * count: number of requested photos (default: 1)
 * page: page number (default: 1)
 * 
 * Returns: array of photo items:
   [{
        url, // static url to show as image
        width,
        height,
        view, // url to link orginal item on flickr
   }, ...]
 */
app.get('/location/photos', (req: $Request, res: $Response, next: NextFunction) => {

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
app.use((err: any, req: $Request, res: $Response, next: NextFunction) => {
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
