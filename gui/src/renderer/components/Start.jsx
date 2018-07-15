import React from 'react';
import Navigation from './Panel/Navigation.jsx'

export default class Start extends React.Component {

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
          <h1 className="text-medium text-gray">Start</h1>
            <div className="container-medium">            
              <img width="268px" src="/logo.png" alt="logo" />
              <h2 className="button button-outlined text-medium"><a target="_blank" href="https://github.com/fstiehle/owl_inspector/blob/master/readme.md">Get started guide</a></h2>
              <h2 className="button button-outlined text-medium"><a target="_blank" href="https://github.com/fstiehle/owl_inspector/tree/master/examples">Example Prolog files</a></h2>
            </div>
          </div>
      </div>     
    </div>;
  }
}