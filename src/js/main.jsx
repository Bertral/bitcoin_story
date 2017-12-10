import React from 'react';
import ReactDOM from 'react-dom';
import Youtube from 'react-youtube';
import { Carousel } from 'react-responsive-carousel';
import PropTypes from 'prop-types';

import {
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function filter(data, props) {
  let ret = data;
  const { first, last } = props;

  if (first !== undefined) {
    ret = ret.filter((elem) => {
      const date = new Date(elem.date);
      return date >= new Date(first);
    });
  }

  if (last !== undefined) {
    ret = ret.filter((elem) => {
      const date = new Date(elem.date);
      return date <= new Date(last);
    });
  }

  return ret;
}

class BPIComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }

  changeCurrency(currency) {
    $.getJSON(`data/bpi_${currency}.json`, (json) => {
      this.setState({ data: filter(json.bpi, this.props) });
    });
  }

  render() {
    const {
      brush,
      width,
      height,
      margin,
    } = this.props;
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
          brush={brush}
          width={width}
          height={height}
          margin={margin}
          data={filter(data, this.props)}
        />
      </div>
    );
  }
}
BPIComponent.propTypes = {
  data: PropTypes.array.isRequired,
  brush: PropTypes.bool,
  children: PropTypes.node,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  margin: PropTypes.object,
};

class BPIChart extends React.Component {
  render() {
    const {
      brush,
      data,
      width,
      height,
      margin,
    } = this.props;

    return (
      <LineChart width={width} height={height} data={data} margin={margin}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="date" stroke="#000000"/>
        <YAxis stroke="#000000"/>
        <Tooltip/>
        <Legend verticalAlign="top"/>
        <Line
          name="Bitcoin Price Index"
          type="monotone"
          dataKey="bpi"
          stroke="#444444"
          dot={false}
        />
        { brush &&
          <Brush dataKey="date" className="brush" width={600} height={20} stroke="#d4af37"/>
        }
      </LineChart>
    );
  }
}
BPIChart.propTypes = {
  data: PropTypes.array.isRequired,
  brush: PropTypes.bool,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  margin: PropTypes.object,
};

class HashrateChart extends React.Component {
  render() {
    const {
      data,
      width,
      height,
      margin,
    } = this.props;

    return (
      <BarChart
        width={width}
        height={height}
        data={filter(data, this.props)}
        margin={margin}
      >
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="date" stroke="#000000"/>
        <YAxis stroke="#000000"/>
        <Tooltip/>
        <Legend verticalAlign="top"/>
        <Bar
          name="Hashrate"
          dataKey="value"
          fill="#d4af37"
        />
      </BarChart>
    );
  }
}
HashrateChart.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  margin: PropTypes.object,
};

const margin = {
  top: 5,
  bottom: 5,
  right: 50,
  left: 50,
};

$.getJSON('data/bpi_usd.json', (json) => {
  ReactDOM.render(
    <BPIComponent data={json.bpi} width={1000} height={400} margin={margin} brush={true}/>,
    document.getElementById('whole-graph'),
  );

  ReactDOM.render(
    <BPIComponent
      data={json.bpi}
      width={450}
      height={300}
      margin={margin}
      first="2017-06-15"
      last="2017-08-15"
    />,
    document.getElementById('update-graph'),
  );

  ReactDOM.render(
    <BPIComponent
      data={json.bpi}
      width={450}
      height={300}
      margin={margin}
      first="2017-10-8"
      last="2017-12-12"
    />,
    document.getElementById('segwit-graph'),
  );
});

$.getJSON('data/hashrate.json', (json) => {
  ReactDOM.render(
    <HashrateChart
      data={json.values}
      width={450}
      height={300}
      margin={margin}
      first="2017-11-4"
      last="2017-11-14"
    />,
    document.getElementById('hashrate-graph'),
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
  document.getElementById('youtube'),
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
  document.getElementById('carousel'),
);

