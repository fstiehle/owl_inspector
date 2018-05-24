import React from 'react';
import {NavLink} from 'react-router-dom'

export default class Navigation extends React.Component {
  render() {
    return <div className="panel">
      <div className="items">
        <NavLink exact activeClassName="active" to="/">
          <div>Source</div>
        </NavLink>
        <NavLink activeClassName="active" to="/propagation">
          <div>Propagation</div>
        </NavLink>
        <NavLink activeClassName="active" to="/search-tree">
          <div>Search Tree</div>
        </NavLink>
        <NavLink activeClassName="active" to="/constraints">
          <div>Constraints</div>
        </NavLink>
        <NavLink activeClassName="active" to="/log">
          <div>Log</div>
        </NavLink>
      </div>
    </div>;
  }
}