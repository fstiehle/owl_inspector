import React from 'react';
import {NavLink} from 'react-router-dom'

export default class Navigation extends React.Component {
  render() {
    return <div className="panel">
      <div className="items">
        <NavLink exact activeClassName="active" to="/">
          <div>Source</div>
        </NavLink>
        <NavLink activeClassName="active" to="/constraints">
          <div>Propagation</div>
        </NavLink>
        <NavLink activeClassName="active" to="/log">
          <div>Log</div>
        </NavLink>
      </div>
    </div>;
  }
}