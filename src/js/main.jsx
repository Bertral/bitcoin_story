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

  filter(data) {
    const { first, last } = this.props;

    if (first !== undefined) {
      data = data.filter((elem) => {
        const date = new Date(elem.date);
        return date >= new Date(first);
      });
    }

    if (last !== undefined) {
      data = data.filter((elem) => {
        const date = new Date(elem.date);
        return date <= new Date(last);
      });
    }

    return data;
  }

  changeCurrency(currency) {
    $.getJSON(`data/bpi_${currency}.json`, (json) => {
      this.setState({data: this.filter(json.bpi)});
    });
  }

  render() {
    const { children, width, height, margin } = this.props;
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

        <BPIChart
          width={width}
          height={height}
          margin={margin}
          data={this.filter(data)}
          children={children}
        />
      </div>
    );
  }
}

class BPIChart extends React.Component {
  render() {
    const { children, data, width, height, margin } = this.props;

    return (
      <LineChart width={width} height={height} data={data} margin={margin}>
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
  const margin = {
        top: 5,
        bottom: 5,
        right: 50,
        left: 50,
  };

  ReactDOM.render(
    <BPIComponent
      data={json.bpi}
      width={1000}
      height={400}
      margin={margin}
      children={
        <Brush dataKey="date" className="brush" width={600} height={20} stroke="#d4af37"/>
      }
    />,
    document.getElementById('whole-graph')
  );

  ReactDOM.render(
    <BPIComponent
      data={json.bpi}
      width={400}
      height={300}
      first="2017-06-15"
      last="2017-08-15"
    />,
    document.getElementById('update-graph')
  );

  ReactDOM.render(
    <BPIComponent
      data={json.bpi}
      width={400}
      height={300}
      first="2017-10-8"
      last="2017-12-8"
    />,
    document.getElementById('segwit-graph')
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
  <Carousel showThumbs={false} width="800px">
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

