import React from 'react';
import ReactDOM from 'react-dom';
import Youtube from 'react-youtube';
import { Carousel } from 'react-responsive-carousel';
import PropTypes from 'prop-types';

import {
  Brush,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

class BPIComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data
    };
  }

  changeCurrency(currency) {
    $.getJSON(`data/bpi_${currency}.json`, (json) => {
      this.setState({data: json.bpi});
    });
  }

  render() {
    const { children } = this.props;
    const { data } = this.state;

    return (
      <div>
        <div className="btn-group">
          <button onClick={() => this.changeCurrency('usd')}>USD</button>
          <button onClick={() => this.changeCurrency('cny')}>CNY</button>
          <button onClick={() => this.changeCurrency('eur')}>EUR</button>
          <button onClick={() => this.changeCurrency('jpy')}>JPY</button>
          <button onClick={() => this.changeCurrency('chf')}>CHF</button>
        </div>

        <BPIChart data={data} children={children}/>
      </div>
    );
  }
}

class BPIChart extends React.Component {
  render() {
    const { children, data } = this.props;

    return (
      <LineChart
        width={1000}
        height={400}
        data={data}
        margin={{
          top: 5,
          bottom: 5,
          right: 50,
          left: 50,
        }}
      >
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="date" stroke="#000000"/>
        <YAxis stroke="#000000"/>
        <Tooltip/>
        {children}
        <Legend verticalAlign="top"/>
        <Line name="Bitcoin Price Index" type="monotone" dataKey="bpi" stroke="#444444" dot={false}/>
      </LineChart>
    );
  }
}
BPIChart.propTypes = {
  data: PropTypes.array.isRequired,
};

$.getJSON('data/bpi_usd.json', (json) => {
  ReactDOM.render(
    <BPIComponent
      data={json.bpi}
      children={
        <Brush dataKey="date" className="brush" width={600} height={20} stroke="#d4af37"/>
      }
    />,
    document.getElementById('whole-graph')
  );
});

ReactDOM.render(
  <Youtube
  videoId={'bBC-nXj3Ng4'}
  opts={{
    height: '480',
      width: '854',
  }}
  />,
  document.getElementById('youtube')
);

ReactDOM.render(
  <Carousel showThumbs={false} width={800}>
    <div className="text-white">
      <h4>Hard Forks</h4>
      <img className="mt-5" src="images/en-hard-fork.svg"/>
      <div className="mb-5">https://www.investopedia.com/terms/s/soft-fork.asp</div>
    </div>
    <div className="text-white">
      <h4>Soft Forks</h4>
      <img className="mt-5" src="images/en-soft-fork.svg"/>
      <div className="mb-5">https://www.investopedia.com/terms/s/soft-fork.asp</div>
    </div>
  </Carousel>,
  document.getElementById('carousel')
);

