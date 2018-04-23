import React from 'react';
import {NavLink} from 'react-router-dom'

export default class Layout extends React.Component {
  render() {
    return <div className="panel">
      <NavLink activeClassName="active" to="/"><div>Source</div></NavLink>
      <NavLink activeClassName="active" to="/domains"><div>Domains</div></NavLink>
      <NavLink activeClassName="active" to="/labelling"><div>Labelling</div></NavLink>
    </div>;
  }
}