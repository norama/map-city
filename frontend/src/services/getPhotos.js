import request from 'request';
import config from '../config';

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
            alert('Photos server error\nSee console for details.');
            console.error(error);
            callback(null);
            return;
        }

        const data = JSON.parse(body);

        if (response.statusCode !== 200) {
            alert('Photos data error\nSee console for details.');
            console.error(data);
            callback(null);
        } else {
            callback(data);
        }
    });
}