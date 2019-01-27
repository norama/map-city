import request from 'request';
import config from '../config';

export default function getPhotos(latlng, callback) {
    request({
        url: config.serviceUrl + '/' + config.serviceEndpoint + '/photos',
        qs: {
            lat: latlng.lat,
            lon: latlng.lng,
            size: 's',
            count: 10,
            page: 1
        }
    }, (error, response, body) => {

        if (error) {
            alert('Server error\nSee console for details.');
            console.error(error);
            return;
        }

        const data = JSON.parse(body);

        if (response.statusCode !== 200) {
            alert('Photos data error\nSee console for details.');
            console.error(data);
        } else {
            callback(data);
        }
    });
}