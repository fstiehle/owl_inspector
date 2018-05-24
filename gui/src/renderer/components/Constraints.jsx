import React from 'react';
import Navigation from './Panel/Navigation.jsx'
import ReactEcharts from 'echarts-for-react';

const TableItem = (props) => {
  const constraintsList = props.constraints.map(element =>
    <p>{element}</p>
  )
  return (
    <tr>
      <td data-th="First column">{props.name}</td>
      <td data-th="Second column">{constraintsList}</td>
    </tr>
  )}


export default class Constraints extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      compare: ["select"]
    }
  }

  handleSelect(event) {
    if (event.target.value === "select")
      return
    this.setState({compare: event.target.value})
  }

  generateConstraintsTable(names, map) {
    if (map.length <= 0)
      return []
    let object = {}
    names.forEach(name => {
      object[name] = []
    })
    map.forEach(element => {
      if (!element[0].id) {
        return // skip labels
      }
      element.forEach(label => {
        if (names.includes(label.name)) {
          object[label.name].push(label.id)
        }
      })
    })
    return names.map(name =>
      <TableItem key={name} name={name} constraints={object[name]}/>
    )
  }

  generateSelect(comparisons, checked) {
    if (!comparisons|| comparisons.length <= 0) {
      return []
    }
    const options = this.props.comparisons.map(comparison => 
      <option value={comparison.names.toString()} key={comparison.names.toString()}>
        {comparison.names[0] + " and " + comparison.names[1]}
      </option>)
      
    return <div className="select full-width">
      <select onChange={this.handleSelect.bind(this)} name="plot" id="plot" value={checked.toString()}>
        <option value="select" key="select">Select...</option>
        {options}
      </select>
      <i className="fa fa-angle-down fa-2"></i>
    </div>
  }  

  generateChartOptions(comparisons) {
    if (!comparisons || comparisons.length <= 0) 
      return {}    

    let data = comparisons.find(comparison => {
      return comparison.names.toString() === this.state.compare
    })  
    if (!data) {
      return {}
    }
    data = data.possibleValues.map(element => [...element, 1])
    const min = data.map(item => item.min()).min()
    const max = data.map(item => item.max()).max()

    console.log(data)

    return {
      tooltip: {},
      grid: {
        height: '50%',
        y: '10%'
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        type: 'category'
      },
      series: [{
        name: 'Punch Card',
        type: 'heatmap',
        data: data,
        label: {
          normal: {
            show: true
          }
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    }
  }

  render() {
    const option = this.generateChartOptions(this.props.comparisons)

    return <div className="split-view">
      <div className="col-xs-12 col-md-2">
        <Navigation />
      </div>
      <div className="col-xs-12 col-md-10 content">
        <div className="border-top">
          <h1 className="text-medium text-gray">Plot against</h1>

          <div className="message-bar background-info">
            <p>Your compared variables will appear here. 
              Note that using the <i>compare_against</i> predicate can substantially affect performance.</p>
          </div>
          
          <div className="col-xs-12 col-md-5 content">
            {this.generateSelect(this.props.comparisons, 
              this.state.compare)}
          </div>
          
          <ReactEcharts
            option={option}
            style={{'minHeight': '70vh', width: '100%'}}
            lazyUpdate={true}
            theme={"light"}/>
          </div>
      </div>     
    </div>;
  }
}