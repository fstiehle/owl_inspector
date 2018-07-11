import React from 'react';
import Navigation from './Panel/Navigation.jsx'
import TimeWind from './Panel/TimeWind.jsx'
import ReactEcharts from 'echarts-for-react';

export default class SearchTree extends React.Component {

  constructor(props) {
    super(props)
  }

  generateDataMap(names, map) {
    if (map.length <= 0)
      return []
    let tree = {}
    tree.name = "Search tree"
    tree.data = []
    map.forEach(element => {      
      this.insertIntoDataMapR(element, tree)
    })
    return tree
  }

  generateChild(tree, grounded, values, names) {
    const valueNames = values.map(value => {
      if (value.startsWith("_")) {
        return "ungrounded"
      } else {
        return value;
      }
    })
    return {
      name: grounded.toString(),
      data: grounded,
      info: {
        values: valueNames,
        names: names
      }
    }
  }

  insertIntoDataMapR(element, tree) {
    const values = element.map(label => label.value)
    const grounded = values.filter(value => !value.startsWith("_"))
    const names = element.map(label => label.name)

    if (!tree.children) {
      tree.children = [this.generateChild(tree, 
        grounded,
        values,
        names
      )]
      return
    }
    
    for (const key in tree.children) {
      if (tree.children.hasOwnProperty(key)) {
        const child = tree.children[key]
        let isEvery = child.data.every(item => grounded.includes(item))
        if (isEvery) {
          return this.insertIntoDataMapR(element, child)
        }        
      }
    }
    // no matching child found, add new
    tree.children.push(this.generateChild(tree, 
      grounded,
      values,
      names))
  }

  generateChartOption(names, map) {
    if (map.length <= 0)
      return {}
    return {
      tooltip: {
        formatter: (param) => {
          const data = param.data
          if (data.info.values.length !== data.info.names.length) {
            return "Missformed data"
          }
          let string = "<b>Variables</b><br/>"
          for (let i = 0; i < data.info.values.length; i++) {
            string += `${data.info.names[i]}: ${data.info.values[i]}<br/>`
          }
          return string
        }},        
      series: [{
        type: 'tree',
        data: [map],
        left: '2%',
        right: '2%',
        top: '8%',
        bottom: '20%',  
        symbol: 'emptyCircle',
        symbolSize: 12,
        orient: 'vertical',
        expandAndCollapse: true,
        initialTreeDepth: 10,
        itemStyle: {
          borderColor: '#fff'
        },
        label: {
          normal: {
            color: '#969da6',
            position: 'right',
            verticalAlign: 'middle',
            align: 'left',
            fontSize: 14
        }},
        leaves: {
          itemStyle: {
            color: '#f4891e'
          },
          label: {
            normal: {
              color: '#969da6',
              position: 'bottom',
              verticalAlign: 'middle',
              distance: 12,
              align: 'middle'
            }
          }
        },
        animationDurationUpdate: 750
      }]
    }
  }

  render() {
    const map = this.generateDataMap(this.props.names, this.props.map)
    console.log(map)
    return <div className="split-view">
    <div className="col-xs-12 col-md-2">
      <Navigation />
    </div>
    <div className="col-xs-12 col-md-10 content">
      <div className="border-top">
        <h1 className="text-medium text-gray">Search tree</h1>
        <ReactEcharts
          option={this.generateChartOption(this.props.names, map)}
          style={{'height': '63vh', width: '100%'}}
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