'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _getWeather = require('./getWeather');

var _getWeather2 = _interopRequireDefault(_getWeather);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.use((0, _cors2.default)());
app.use((0, _morgan2.default)('combined'));

var port = 3002;

/* GET index page. */
app.get('/', function (req, res) {
    res.json({ testkey: 'testvalue' });
});

app.get('/location', function (req, res, next) {

    (0, _getWeather2.default)({ lat: req.query.lat, lng: req.query.lng }, function (weather) {

        res.json({
            weather: weather
        });
    }, next);
});

app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!');
});

/**
 * Sample error:
 * 
 * {
 *     "statusCode": 404,
 *     "payload": {
 *         "statusCode": 404,
 *         "error": "Not Found",
 *         "message": "Internal error"
 *     },
 *     "headers": {}
 * }
 */
app.use(function (err, req, res, next) {
    console.log("ERROR HANDLER --------");
    console.log(err);
    res.status(err.output.statusCode).json(err.output);
});