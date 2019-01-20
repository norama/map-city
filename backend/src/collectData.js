import getWeather from './getWeather';
import getPhotos from './getPhotos';

const collectData = async (req, next) => {

    try {
        const latlon = {lat: req.query.lat, lon: req.query.lon};

        return await Promise.all([
            getWeather(latlon),
            getPhotos(latlon, 3)
        ]);
    
    } catch(error) {
        next(error);
    }

};

export default collectData;