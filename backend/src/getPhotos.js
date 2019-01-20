import request from 'request';
import Boom from 'boom';

const FLICKR_PHOTOS_SERVICES_URL = "https://api.flickr.com/services/rest";
const FLICKR_PHOTOS_SEARCH_METHOD = "flickr.photos.search";
const FLICKR_PHOTOS_APIKEY = "89612f71fcd01cdfed9374a0e651e888";

const FLICKR_PHOTOS_URL = "https://www.flickr.com/photos";

const getPhotos = ({lat, lon}, count, callback, next) => {
    request({
        url: FLICKR_PHOTOS_SERVICES_URL,
        qs: {
            method: FLICKR_PHOTOS_SEARCH_METHOD,
            lat: lat,
            lon: lon,
            format: "json",
            per_page: count,
            api_key: FLICKR_PHOTOS_APIKEY
        }
    }, (error, response, body) => {

        if (error) {
            next(Boom.boomify(error, { statusCode: 500, message: "Flickr: " + error }));
        } else {

            const data = JSON.parse(body);

            if (response.statusCode !== 200) {
                next(new Boom("Flickr error", { statusCode: response.statusCode,  decorate: data  }));
            } else {
                if (data.stat !== "ok") {
                    next(new Boom("Flickr: " + data.message, { decorate: data }));
                } else {
                    callback(photoUrls(data.photos.photo));
                }
            }
        }
    });
};

const photoUrls = (photos) => (photos.map((photo) => photoUrl(photo)));

const photoUrl = (photo) => (`${FLICKR_PHOTOS_URL}/${photo.owner}/${photo.id}`);

export default getPhotos;