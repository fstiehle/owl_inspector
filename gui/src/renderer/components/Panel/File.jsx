import React from 'react';
import Dropzone from 'react-dropzone'

export default class FileUpload extends React.Component {

  onDrop(files) {
    const file = files[0]    
    if (!file || !file.name.match(/\.pl+$/i)) {
      console.log("Invalid File")
      return
    }
    this.props.setTitle(file.name)
    const reader = new FileReader()
    reader.onload = (file) => {
      this.props.setCode(file.target.result)
    }
    reader.readAsText(file)
  }  

  render() {
    return <div className="panel">
      <h3 className="text-medium text-gray">Open Prolog File</h3>
        <Dropzone 
          onDrop={this.onDrop.bind(this)}
          accept=".pl"
          style={{"width": "100%"}}>
          <p className="align-center">
            <button className="button button-primary block-mobile">
              Drop or click
            </button>
          </p>
          
        </Dropzone>
    </div>;
  }
}