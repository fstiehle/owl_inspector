import React from 'react';
import Navigation from './Panel/Navigation.jsx'

export default class Layout extends React.Component {
  render() {
    return <div className="split-view">
      <div className="col-xs-12 col-md-2">
        <Navigation />
      </div>
      <div className="col-xs-12 col-md-10">
        Source
      </div>     
    </div>;
  }
}