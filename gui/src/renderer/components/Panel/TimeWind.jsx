import React from 'react';

export default class TimeWind extends React.Component {

  render() {
    return <div className="panel">
      <h3 className="text-medium text-gray">Time Wind</h3>
      <div className="items text-gray">
        <input type="range" min="-10" max="10" />
      </div>
    </div>;
  }
}

