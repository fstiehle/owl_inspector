import React from 'react';
import {Route, Switch} from 'react-router-dom'
import Log from './Log.jsx'
import Start from './Start.jsx'
import Title from './Title.jsx'
import Propagation from './Propagation.jsx'
import SearchTree from './SearchTree.jsx'
import Parser from './../Parser'
import './../util.js'

export default class Layout extends React.Component {

  constructor(props) {
    super(props)
    this.socket = new WebSocket("ws://localhost:26878/socket")
    this.state = {
      title: "Owl Inspector",
      map: [],
      windedMap: [],
      names: [],
      namesChecked: [],
      timeWind: {min: 0, max: 0},
      maxWind: 0      
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
    this.timeWind(timeWind, this.state.map)
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
    if (time.min >= 0 && time.max <= map.length)
      this.setState({windedMap: map.slice(time.min, time.max)})
  }

  handleData(message) {
    console.log(message)
    let parser
    try {
      parser = new Parser(JSON.parse(message.data))
    } catch (error) {
      console.log('Error during JSON Parsing: ' + error)
    }
    this.setState({
      map: parser.map,
      windedMap: parser.map,
      comparisons: parser.comparisons,
      names: parser.vars,
      namesChecked: parser.vars,
      log: parser.vars + "\n" + JSON.stringify(parser.map, null, 2),
      timeWind: {min: 0, max: parser.map.length},
      maxWind: parser.map.length
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
          <Route path="/propagation" exact 
            render={() => <Propagation 
              names={this.state.names} 
              namesChecked={this.state.namesChecked} 
              map={this.state.windedMap}
              toggleVar={this.toggleVar.bind(this)}
              setTimeWind={this.setTimeWind.bind(this)}
              timeWind={this.state.timeWind}
              maxWind={this.state.maxWind}
            />}/>
          <Route path="/search-tree" exact 
            render={() => <SearchTree
              names={this.state.names} 
              map={this.state.windedMap} 
              setTimeWind={this.setTimeWind.bind(this)}
              timeWind={this.state.timeWind}
              maxWind={this.state.maxWind} 
          />}/>
          <Route path="/" exact render={() => <Start setTitle={this.setTitle.bind(this)}/>}/>
        </Switch>
      </div>
    </div>;
  }
}