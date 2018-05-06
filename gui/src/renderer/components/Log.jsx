import React from 'react';
import Navigation from './Panel/Navigation.jsx'

export default class Log extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return <div className="split-view">
      <div className="col-xs-12 col-md-2">
        <Navigation />
      </div>
      <div className="col-xs-12 col-md-10 content">
        <div className="border-top">
          <h1 className="text-medium text-gray">Log</h1>
          <textarea className="textarea log" value={this.props.log || "No data obtained"} />
        </div>
      </div>     
    </div>;
  }
}