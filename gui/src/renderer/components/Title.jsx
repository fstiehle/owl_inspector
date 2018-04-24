import React from 'react';

export default class Title extends React.Component {

  render() {
    return <div className="title text-medium content-end">
      <div className="col-xs-12 col-md-10">
        {this.props.title}
      </div>
    </div>;
  }
}