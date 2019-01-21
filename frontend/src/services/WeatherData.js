import request from 'request';
import config from '../config';

export default function getWeather(latlng, callback) {
    request({
        url: config.serviceUrl + '/' + config.serviceEndpoint,
        qs: {
            lat: latlng.lat,
            lon: latlng.lng,
            photosCount: 1
        }
    }, (error, response, body) => {

        if (error) {
            console.error(error);
            return;
        }

        const data = JSON.parse(body);

        if (response.statusCode !== 200) {
            console.error(data);
        } else {
            callback(data);
        }
    });
}