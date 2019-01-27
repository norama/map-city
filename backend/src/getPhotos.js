import request from 'request';
import Boom from 'boom';

const FLICKR_PHOTOS_SERVICES_URL = "https://api.flickr.com/services/rest";
const FLICKR_PHOTOS_SEARCH_METHOD = "flickr.photos.search";
const FLICKR_PHOTOS_APIKEY = "89612f71fcd01cdfed9374a0e651e888";

const FLICKR_PHOTOS_URL = "https://www.flickr.com/photos";
const FLICKR_PHOTOS_FRAME = "in/photostream/lightbox";

// sizes: https://www.flickr.com/services/api/misc.urls.html
const getPhotos = ({lat, lon}, size='m', count=1, page=1) => (new Promise((resolve, reject) => {
    getPhotosWithinRadius({lat, lon}, {size, count, page, radius: 32}, resolve, reject);
}));

const getPhotosWithinRadius = ({lat, lon}, {size, count, page, radius}, resolve, reject) => {

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
            page: page,
            api_key: FLICKR_PHOTOS_APIKEY
        }
    }, (error, response, body) => {

        if (error) {
            reject(Boom.boomify(error, { statusCode: 500, message: "Flickr: " + error }));
        } else {

            if (response.statusCode !== 200) {
                console.log(response);
                reject(new Boom("Flickr error", { statusCode: response.statusCode }));
            } else {

                const data = JSON.parse(body);

                if (data.stat !== "ok") {
                    console.log(response);
                    reject(new Boom("Flickr: " + data.message));
                } else {

                    // sometimes returns some photos repeatedly if no more pages,
                    // handle this by explicit check instead of relying on empty photo array
                    if (data.photos.page > data.photos.pages) {
                        resolve([]);
                        return;
                    }

                    const photos = data.photos.photo;
                    console.log(photos);
                    resolve(transform(photos, size));
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
                height: photo[height],
                view: `${FLICKR_PHOTOS_URL}/${photo.owner}/${photo.id}/${FLICKR_PHOTOS_FRAME}`
            });
        }
        return acc;
    }, []);
};

export default getPhotos;