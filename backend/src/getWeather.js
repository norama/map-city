import request from 'request';
import Boom from 'boom';

const OPEN_WEATHER_MAP_URL = "https://api.openweathermap.org/data/2.5/weather";
const OPEN_WEATHER_MAP_APPID = "702a42edfe2011323fbcbe4cc46a6a41";

const OPEN_WEATHER_MAP_ICON_URL = "https://openweathermap.org/img/w";

const getWeather = ({lat, lon} : {lat: number, lon: number}) => (new Promise((resolve: Function, reject: Function) => {
    request({
        url: OPEN_WEATHER_MAP_URL,
        qs: {
            lat: lat,
            lon: lon,
            units: "metric",
            appid: OPEN_WEATHER_MAP_APPID
        }
    }, (error: Error, response: $Response, body: any) => {

        if (error) {
            reject(Boom.boomify(error, { statusCode: 500, message: "Weather: " + error.toString() }));
        } else {

            if (response.statusCode !== 200) {
                reject(new Boom("Weather error", { statusCode: response.statusCode }));
            } else {

                const weather = JSON.parse(body);

                resolve(formatWeather(weather));
            }
        }
    });
}));

const formatWeather = (w: any) => ({
    latlon: {lat: w.coord.lat, lon: w.coord.lon},
    name: w.name,
    country: w.sys.country,
    weather: {
        summary: w.weather[0].main,
        description: w.weather[0].description,
        icon: iconUrl(w.weather[0].icon),
        wind: {speed: w.wind.speed, direction: w.wind.deg},
        humidity: w.main.humidity,
        pressure: w.main.pressure,
        temperature: w.main.temp
    }
});

const iconUrl = (icon: string) => (`${OPEN_WEATHER_MAP_ICON_URL}/${icon}.png`);

export default getWeather;