import React from 'react';
import InputRange from 'react-input-range';

export default class TimeWind extends React.Component {

  handleChange(value) {
    this.props.setTimeWind(value)
  }

  render() {
    return <div className="panel time-wind">
      <h3 className="text-medium text-gray">Time Wind</h3>
      <div className="items text-gray">
        <InputRange
          maxValue={this.props.maxWind}
          minValue={0}
          value={this.props.timeWind} 
          onChange={this.handleChange.bind(this)}/>
      </div>
    </div>;
  }
}

