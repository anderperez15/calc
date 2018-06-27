import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackConfig from '../webpack.config';
import logger from 'morgan';
import bodyParser from'body-parser';
import path from 'path';
import request from 'request';
import redis from 'redis';

//config redis
const client = redis.createClient();
client.on("error", function (err) {
  console.log("Error " + err);
});
// initializing packages
const app = express();
//functions
const dataCriptocoins = () => {
  request('https://api.coinmarketcap.com/v2/ticker/?start=1&limit=1000&sort=id&structure=array', (error, response, body) => {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    if(response.statusCode) client.set('data', body);    
  });
};

// settings
app.set('port', process.env.PORT || 3000);

// middlwares
app.use(webpackDevMiddleware(webpack(webpackConfig)));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './src/client/public')));

// routes

app.get('/api', (req, res) => {
  client.get('data', (err, data) => {
    res.json(JSON.parse(data)).status(200);
  });
});

// starting the server

app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});

dataCriptocoins();
setInterval(dataCriptocoins, 10*60*1000);
