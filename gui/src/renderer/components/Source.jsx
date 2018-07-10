import React from 'react';
import Navigation from './Panel/Navigation.jsx'
import FileUpload from './Panel/File.jsx'
import {Controlled as CodeMirror} from 'react-codemirror2';

const options = {
  lineNumbers: true,
  mode: 'prolog',
  theme: 'base16-dark'
}

export default class Source extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      value: "% Code"
    }
  }

  updateCode(value) {
    this.setState({value})
  }

  onEditorChange(editor, data, value) {
    this.updateCode(value)
  }

  render() {
    return <div className="split-view">
      <div className="col-xs-12 col-md-2">
        <FileUpload 
          setTitle={this.props.setTitle}
          setCode={this.updateCode.bind(this)}
        />
        <Navigation />
      </div>
      <div className="col-xs-12 col-md-10 content">
        <div className="border-top">
          <h1 className="text-medium text-gray">Source</h1>
          <CodeMirror 
            value={this.state.value} 
            onBeforeChange={this.onEditorChange.bind(this)}
            options={options} 
          />
        </div>
      </div>     
    </div>;
  }
}