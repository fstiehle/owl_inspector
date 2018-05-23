import React from 'react';
import {Route, Switch} from 'react-router-dom'
import Log from './Log.jsx'
import Source from './Source.jsx'
import Title from './Title.jsx'
import ConstraintView from './ConstraintView.jsx'
import Parser from './../Parser'
import './../util.js'

export default class Layout extends React.Component {

  constructor(props) {
    super(props)
    this.socket = new WebSocket("ws://localhost:26878/socket")
    this.state = {
      title: "Owl Inspector",
      map: [],
      names: [],
      namesChecked: [],
      // Timestamp from which to start, 0: show all
      timeWind: 0,
      windedMap: []
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

  setTimeWind(timeWind) {
    this.setState({timeWind})
    this.timeWind(timeWind, this.state.windedMap)
  }

  toggleVar(vari) {
    if (this.state.namesChecked.includes(vari)) {
      this.setState({namesChecked: this.state.namesChecked.remove(vari)})
    } else {
      this.setState({namesChecked: [...this.state.namesChecked, vari]})
    }
  }

  /*
   * Reduces map to the point of time
   */
  timeWind(time, map) {
    if (time >= 0 && time <= map.length)
      this.setState({windedMap: map.slice(time)})
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
      names: parser.vars,
      namesChecked: parser.vars,
      log: parser.vars + "\n" + JSON.stringify(parser.map, null, 2)
    })
    this.timeWind(this.state.timeWind, parser.map)
  }

  render() {
    return <div>
      <Title title={this.state.title}/>
      <header>        
      </header>
      <div className="wrapper">
        <Switch>
          <Route path="/log" exact render={() => <Log log={this.state.log}/>}/>
          <Route path="/constraints" exact 
            render={() => <ConstraintView 
              names={this.state.names} 
              namesChecked={this.state.namesChecked} 
              map={this.state.windedMap}
              toggleVar={this.toggleVar.bind(this)}
            />}/>
          <Route path="/" exact render={() => <Source setTitle={this.setTitle.bind(this)}/>}/>
        </Switch>
      </div>
    </div>;
  }
}