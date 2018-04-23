import React from 'react';
import Navigation from './Panel/Navigation.jsx'

export default class Layout extends React.Component {
  render() {
    return <div className="split_view">
      <div className="side">
        <Navigation />
      </div>
      <div className="content">
        Source
      </div>     
    </div>;
  }
}