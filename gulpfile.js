const gulp = require('gulp');
const webpack = require('webpack');
const gulpwebpack = require('gulp-webpack');

const https = require('https');
const fs = require('fs');

const _ = require('lodash');
const express = require('express');

const bpi_url = 'https://api.coindesk.com/v1/bpi/historical/close.json?start=2013-09-01&end=';
const hashrate_url = 'https://api.blockchain.info/charts/hash-rate?timespan=all&format=json';

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let body = '';

      response.on('data', (chunk) => {
        body += chunk;
      });

      response.on('end', () => {
        resolve(body.toString('utf8'));
      });
    });
  });
}

function save(file, data) {
  fs.writeFile(file, data, (err) => {
    if(err) {
      return console.log(err);
    }
  });
}

gulp.task('download', () => {
  let bpi_url_now = bpi_url + new Date().toISOString().slice(0,10);

  const currencies = [
    bpi_url_now,
    bpi_url_now + '&currency=EUR',
    bpi_url_now + '&currency=CHF',
    bpi_url_now + '&currency=JPY',
    bpi_url_now + '&currency=CNY',
  ];

  const files = [
    'bpi_usd.json',
    'bpi_eur.json',
    'bpi_chf.json',
    'bpi_jpy.json',
    'bpi_cny.json',
  ];

  for(let i = 0; i < currencies.length; i++) {
    download(currencies[i]).then((response) => {
      const data = JSON.parse(response);
      const array = [];

      _.forOwn(data.bpi, (value, key) => {
        array.push({
          "date": key,
          "bpi": value,
        });
      });

      data.bpi = array;
      save('data/' + files[i], JSON.stringify(data));
    });
  }

  download( hashrate_url).then((response) => {
    save('data/hashrate.json', response);
  });
});

gulp.task('package', () => {
  return gulpwebpack({
    entry: './src/js/main.jsx',
    cache: true,
    output: {
      filename: 'pack.js',
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        parallel: true,
      }),
    ],
    module: {
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          },
        },
      ],
    },
  }, webpack)
    .pipe(gulp.dest('dist/js'));
});

gulp.task('express', () => {
  const app = express();

  app.use(express.static('static'));
  app.use(express.static('dist'));
  app.use('/data', express.static('data'));

  app.listen(8080);
});
