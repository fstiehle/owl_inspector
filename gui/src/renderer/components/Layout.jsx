import React from 'react';
import {Route, Switch} from 'react-router-dom'
import Source from './Source.jsx'

export default class Layout extends React.Component {
  render() {
    return <div>
      <header>
      </header>
      <div className="wrapper">
        <Switch>
          <Route path="/" exact component={Source} />
        </Switch>
      </div>
    </div>;
  }
}