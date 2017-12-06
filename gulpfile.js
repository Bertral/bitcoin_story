const gulp = require('gulp');
const webpack = require('webpack');
const gulpwebpack = require('gulp-webpack');

const https = require('https');
const fs = require('fs');

const bpi_url = 'https://api.coindesk.com/v1/bpi/historical/close.json?start=2013-09-01&end=2017-11-26';

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      resolve(response);
    });
  });
}

function save(file, data) {
  data.pipe(file);
}

gulp.task('download', () => {
  const currencies = [
    bpi_url,
    bpi_url + '&currency=EUR',
    bpi_url + '&currency=CHF',
    bpi_url + '&currency=JPY',
    bpi_url + '&currency=CNY',
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
      const file = fs.createWriteStream('data/' + files[i]);
      save(file, response);
    });
  }
});

gulp.task('package', () => {
  return gulpwebpack({
    entry: './src/js/main.js',
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
