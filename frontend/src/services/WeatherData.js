import $ from 'jquery';

const SERVICE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const APP_ID = '702a42edfe2011323fbcbe4cc46a6a41';

// https://api.openweathermap.org/data/2.5/weather?lat=51.5&lon=-0.1&appid=702a42edfe2011323fbcbe4cc46a6a41


export default function getWeather(latlng, callback) {
  $.getJSON(SERVICE_URL, {
    lat: latlng.lat, 
    lon: latlng.lng, 
    units: 'metric',
    appid: APP_ID})
  .done((data) => {
    console.log("weather", data);
    callback(data);
  })
  .fail((jqxhr, textStatus, error) => {
    const err = textStatus + ", " + error;
    console.log("Weather service failed: " + err);
  });
}