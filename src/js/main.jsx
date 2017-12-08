import React from 'react';
import ReactDOM from 'react-dom';
import Youtube from 'react-youtube';
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


class LanguageChart extends React.Component {
  render() {
    const { children, data } = this.props;

    return (
      <LineChart width={800} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="date"/>
        <YAxis/>
        <Tooltip/>
        {children}
        <Legend verticalAlign="top"/>
        <Line name="Bitcoin Price Index" type="monotone" dataKey="bpi" stroke="#8884d8" dot={false}/>
      </LineChart>
    );
  }
}
LanguageChart.propTypes = {
  data: PropTypes.array.isRequired,
};

$.getJSON('data/bpi_chf.json', (data) => {
  ReactDOM.render(
    <LanguageChart
      data={data.bpi}
      children={
        <Brush dataKey="date" height={20} stroke="#8884d8"/>
      }
    />,
    document.getElementById('whole-graph')
  );
});

ReactDOM.render(
  <Youtube
  videoId={'bBC-nXj3Ng4'}
  opts={{
    height: '390',
      width: '640',
  }}
  />,
  document.getElementById('youtube')
);
