'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OPEN_WEATHER_MAP_URL = "https://api.openweathermap.org/data/2.5/weather22";
var OPEN_WEATHER_MAP_APPID = "702a42edfe2011323fbcbe4cc46a6a41";

var getWeather = function getWeather(_ref, callback, next) {
    var lat = _ref.lat,
        lng = _ref.lng;

    (0, _request2.default)({
        url: OPEN_WEATHER_MAP_URL,
        qs: {
            lat: lat,
            lon: lng,
            units: "metric",
            appid: OPEN_WEATHER_MAP_APPID
        }
    }, function (error, response, body) {

        if (error) {
            next(_boom2.default.boomify(error, { statusCode: 500, message: error }));
        } else {

            var weather = JSON.parse(body);

            if (response.statusCode !== 200) {
                next(new _boom2.default(weather.message, { statusCode: response.statusCode }));
            } else {
                callback(weather);
            }
        }
    });
};

exports.default = getWeather;