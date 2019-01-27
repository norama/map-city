import request from 'request';
import config from '../config';
import { showError } from './notify';

export default function getPhotos(latlng, count, page, callback) {
    request({
        url: config.serviceUrl + '/' + config.serviceEndpoint + '/photos',
        qs: {
            lat: latlng.lat,
            lon: latlng.lng,
            size: 's',
            count,
            page,
        }
    }, (error, response, body) => {

        if (error) {
            showError('Photos server error');
            console.error(error);
            callback(null);
            return;
        }

        const data = JSON.parse(body);

        if (response.statusCode !== 200) {
            showError('Photos data error');
            console.error(data);
            callback(null);
        } else {
            callback(data);
        }
    });
}