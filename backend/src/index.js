import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
app.use(cors());
app.use(morgan('combined'));

const port = 3002;

/* GET index page. */
app.get('/', (req, res) => {
    res.json({testkey: 'testvalue'});
});

app.get('/city/:name', (req, res) => {
    console.log(req);
    res.json(req.params);
});

app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!');
});