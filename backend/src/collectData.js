import getWeather from './getWeather';
import getPhotos from './getPhotos';

const collectData = async (req: $Request, next: NextFunction) => {

    try {
        const latlon = {lat: req.query.lat, lon: req.query.lon};
        const size = req.query.size ? req.query.size : 's';
        const photosCount = req.query.photosCount ? req.query.photosCount : 1;

        return await Promise.all([
            getWeather(latlon),
            getPhotos(latlon, size, photosCount)
        ]);
    
    } catch(error) {
        next(error);
    }

};

export default collectData;