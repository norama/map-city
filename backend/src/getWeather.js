import request from 'request';
import Boom from 'boom';

const OPEN_WEATHER_MAP_URL = "https://api.openweathermap.org/data/2.5/weather";
const OPEN_WEATHER_MAP_APPID = "702a42edfe2011323fbcbe4cc46a6a41";

const getWeather = ({lat, lon}) => (new Promise((resolve, reject) => {
    request({
        url: OPEN_WEATHER_MAP_URL,
        qs: {
            lat: lat,
            lon: lon,
            units: "metric",
            appid: OPEN_WEATHER_MAP_APPID
        }
    }, (error, response, body) => {

        if (error) {
            reject(Boom.boomify(error, { statusCode: 500, message: "Weather: " + error }));
        } else {

            const weather = JSON.parse(body);

            if (response.statusCode !== 200) {
                reject(new Boom("Weather: " + weather.message, { statusCode: response.statusCode }));
            } else {
                resolve(weather);
            }
        }
    });
}));

export default getWeather;