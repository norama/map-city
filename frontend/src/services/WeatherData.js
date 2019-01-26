import request from 'request';
import config from '../config';

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
            alert('Server error\nSee console for details.');
            console.error(error);
            return;
        }

        const data = JSON.parse(body);

        if (response.statusCode !== 200) {
            alert('Weather data error\nSee console for details.');
            console.error(data);
        } else {
            callback(data);
        }
    });
}