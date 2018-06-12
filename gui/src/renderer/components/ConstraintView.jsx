import React from 'react';
import Navigation from './Panel/Navigation.jsx'
import Variables from './Panel/Variables.jsx'
import TimeWind from './Panel/TimeWind.jsx'
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl';

export default class ConstraintView extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      map: [],
      data: [],
      names: [],
      chartOption: {}
    }
  }

  /**
   * Update state when new winded map is received
   * @param {*} nextProps 
   * @param {*} prevState 
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.map.length == prevState.map.length 
      && nextProps.namesChecked.length == prevState.names.length) {
        return null
    }
    let map = ConstraintView.generateDataMap(nextProps.namesChecked, nextProps.map)
    let chartOption = ConstraintView.generateChartOption(nextProps.namesChecked, map)
    return {
      map: nextProps.map,
      names: nextProps.namesChecked,
      data: map,
      chartOption: chartOption
    }
  }

  static generateChartOption(names, map) {
    return {
      tooltip: {
        formatter: (param) => {
          return `Var: ${param.data.info[0]}<br />
            Domain: ${param.data.info[1]}<br />
            Value: ${param.data.info[2]}`
        }},
      visualMap: {
        max: 10,
        inRange: {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8',
          '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']}},
      xAxis3D: { type: 'category' },
      yAxis3D: {
        type: 'category',
        data: names
        },
      zAxis3D: { type: 'value' },
      grid3D: {
        boxWidth: 450,
        boxDepth: 120,
        viewControl: {
          projection: 'orthographic'
        },
      },
      textStyle : { color: "#fffff" },
      series: [{
        type: 'bar3D',
        data: map.map(item => {
          return {
            value: item.data,
            info: item.info }}),
        shading: 'lambert',  
        label: {
          textStyle: {
            fontSize: 16,
            borderWidth: 1}},
        emphasis: {
          label: {
            textStyle: {
              fontSize: 20 }}
        }
      }]
    }
  }

  static generateDataMap(names, map) {
    let newMap = [];  
    for (let i = 0; i < map.length; ++i) {
      map[i].forEach(element => {

        let nameIndex = names.indexOf(element.name)
        if (nameIndex < 0) { 
          return // skip variable
        }

        let value;
        if (element.value.startsWith("_")) {
          value = "ungrounded"
        } else {
          value = element.value;
        }
        newMap.push(
          { data: [i,
            names.indexOf(element.name),
            element.domainSize],
            info: [ element.name,
              element.domain,
              value
            ]
          })
      })
    }
    return newMap
  }

  render() {
    return <div className="split-view">
      <div className="col-xs-12 col-md-2">
        <Navigation />
        <Variables 
          toggleVar={this.props.toggleVar} 
          namesChecked={this.state.names} 
          names={this.props.names}/>
      </div>
      <div className="col-xs-12 col-md-10 content">
        <div className="border-top">
          <h1 className="text-medium text-gray">Constraint Propagation</h1>
          <ReactEcharts
            option={this.state.chartOption}
            style={{'minHeight': '70vh', width: '100%'}}
            lazyUpdate={true}
            theme={"light"}/>
          <TimeWind 
            timeWind={this.props.timeWind}
            setTimeWind={this.props.setTimeWind}
            maxWind={this.props.maxWind}/>
        </div>
      </div>
    </div>;
  }
}