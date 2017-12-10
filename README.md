# Bitcoin Story
### An interactive article on the effects of forks on Bitcoin
## About
This repository hosts the source code for the webpage available [here](https://bertral.github.io/bitcoin_story/).

## Installation
To deploy this website, you will need [npm](https://www.npmjs.com/) and [Gulp](https://gulpjs.com/). Simply clone this repository, browse into it's root, and use your command line interface :
```
$ npm install
```
Then :
```
$ gulp package
```
Finally, download the raw data directly from CoinDesk and Blockchain's API :
```
$ gulp download
```
## Run locally
A Gulp task has been prepared to run the website locally using express.
```
$ gulp express
```
The site will then be available on [http://localhost:8080](http://localhost:8080)
## Data sources
[CoinDesk](https://www.coindesk.com/price/) for the price index.
[Blockchain](https://blockchain.info/en/charts/hash-rate) for the hash rate.
## Authors
[Antoine Friant](https://github.com/Bertral)
[Valentin Finini](https://github.com/Farenjihn)
