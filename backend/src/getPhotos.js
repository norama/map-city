import request from 'request';
import Boom from 'boom';

const FLICKR_PHOTOS_SERVICES_URL = "https://api.flickr.com/services/rest";
const FLICKR_PHOTOS_SEARCH_METHOD = "flickr.photos.search";
const FLICKR_PHOTOS_APIKEY = "89612f71fcd01cdfed9374a0e651e888";

// sizes: https://www.flickr.com/services/api/misc.urls.html
const getPhotos = ({lat, lon}, size='m', count=1) => (new Promise((resolve, reject) => {
    getPhotosWithinRadius({lat, lon}, size, count, 4, resolve, reject);
}));

const getPhotosWithinRadius = ({lat, lon}, size, count, radius, resolve, reject) => {

    request({
        url: FLICKR_PHOTOS_SERVICES_URL,
        qs: {
            method: FLICKR_PHOTOS_SEARCH_METHOD,
            nojsoncallback: 1,
            lat: lat,
            lon: lon,
            radius: radius,
            extras: "url_" + size,
            format: "json",
            per_page: count,
            api_key: FLICKR_PHOTOS_APIKEY
        }
    }, (error, response, body) => {

        if (error) {
            reject(Boom.boomify(error, { statusCode: 500, message: "Flickr: " + error }));
        } else {

            const data = JSON.parse(body);

            if (response.statusCode !== 200) {
                reject(new Boom("Flickr error", { statusCode: response.statusCode, decorate: data }));
            } else {
                if (data.stat !== "ok") {
                    reject(new Boom("Flickr: " + data.message));
                } else {
                    const photos = data.photos.photo;
                    if (photos.length < count && radius < 32) {
                        getPhotosWithinRadius({lat, lon}, count, 2*radius, resolve, reject);
                    } else {
                        //console.log(photos);
                        resolve(transform(photos, size));
                    }
                }
            }
        }
    });
};

const transform = (photos, size) => {
    const url = "url_" + size;
    const width = "width_" + size;
    const height = "height_" + size;

    return photos.reduce((acc, photo) => {
        if (photo[url]) {
            acc.push({
                url: photo[url],
                width: photo[width],
                height: photo[height]
            });
        }
        return acc;
    }, []);
};

export default getPhotos;