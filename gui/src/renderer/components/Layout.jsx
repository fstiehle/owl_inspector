import React from 'react';
import {Route, Switch} from 'react-router-dom'
import Log from './Log.jsx'
import Source from './Source.jsx'
import Title from './Title.jsx'

export default class Layout extends React.Component {

  constructor(props) {
    super(props)
    this.state = {title: "Owl Inspector"}
  }

  setTitle(title) {
    this.setState({title})
  }

  render() {
    return <div>
      <Title title={this.state.title}/>
      <header>        
      </header>
      <div className="wrapper">
        <Switch>
          <Route path="/log" exact render={() => <Log setTitle={this.setTitle.bind(this)}/>}/>
          <Route path="/" exact render={() => <Source setTitle={this.setTitle.bind(this)}/>}/>
        </Switch>
      </div>
    </div>;
  }
}