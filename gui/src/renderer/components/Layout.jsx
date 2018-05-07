import React from 'react';
import {Route, Switch} from 'react-router-dom'
import Log from './Log.jsx'
import Source from './Source.jsx'
import Title from './Title.jsx'
import ConstraintView from './ConstraintView.jsx'
import Parser from './../Parser'

export default class Layout extends React.Component {

  constructor(props) {
    super(props)
    this.socket = new WebSocket("ws://localhost:26878/socket")
    this.state = {
      title: "Owl Inspector",
      map: {}
    }

    this.socket.onopen = () => {
      this.socket.send('Ping')
    }    
    this.socket.onerror = (error) => {
      console.log('WebSocket Error ' + error)
    }    
    this.socket.onmessage = this.handleData.bind(this)
  }

  setTitle(title) {
    this.setState({title})
  }

  handleData(message) {
    let parser
    try {
      parser = new Parser(JSON.parse(message.data))
    } catch (error) {
      console.log('Error during JSON Parsing: ' + error)
    }
    this.setState({
      map: parser.map,
      log: JSON.stringify(parser.map, null, 2)
    })
  }

  render() {
    return <div>
      <Title title={this.state.title}/>
      <header>        
      </header>
      <div className="wrapper">
        <Switch>
          <Route path="/log" exact render={() => <Log log={this.state.log}/>}/>
          <Route path="/constraints" exact render={() => <ConstraintView map={this.state.map}/>}/>
          <Route path="/" exact render={() => <Source setTitle={this.setTitle.bind(this)}/>}/>
        </Switch>
      </div>     
    </div>;
  }
}