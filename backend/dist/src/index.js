'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.use((0, _cors2.default)());
app.use((0, _morgan2.default)('combined'));

var port = 3002;

/* GET index page. */
app.get('/', function (req, res) {
    res.json({ testkey: 'testvalue' });
});

app.get('/city/:name', function (req, res) {
    console.log(req);
    res.json(req.params);
});

app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!');
});