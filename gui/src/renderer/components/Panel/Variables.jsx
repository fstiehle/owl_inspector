import React from 'react';

const Checkbox = (props) => {
  return (
    <div className="checkbox">
      <input onChange={props.onChange} id={props.name} name={props.name} type="checkbox" checked={props.checked} />
      <label htmlFor={props.name}>{props.name}</label>
    </div>
  )}

export default class Variables extends React.Component {

  handleCheckbox(event) {
    this.props.toggleVar(event.target.id)
  }

  render() {
    const names = this.props.names
    const listItems = names.map(name => 
      <Checkbox key={name} name={name} 
        checked={this.props.namesChecked.includes(name)}
        onChange={this.handleCheckbox.bind(this)}/>
    );

    return <div className="panel">
      <h3 className="text-medium text-gray">Observed Variables</h3>
      <div className="items text-gray">
        {listItems}
      </div>
    </div>;
  }
}