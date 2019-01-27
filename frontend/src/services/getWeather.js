import request from 'request';
import config from '../config';
import { showError } from './notify';

export default function getWeather(latlng, callback) {
    request({
        url: config.serviceUrl + '/' + config.serviceEndpoint,
        qs: {
            lat: latlng.lat,
            lon: latlng.lng,
            size: 's',
            photosCount: 2
        }
    }, (error, response, body) => {

        if (error) {
            showError('Weather server error');
            console.error(error);
            callback(null);
            return;
        }

        const data = JSON.parse(body);

        if (response.statusCode !== 200) {
            showError('Weather data error');
            console.error(data);
            callback(null);
        } else {
            callback(data);
        }
    });
}