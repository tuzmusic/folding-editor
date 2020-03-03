import React from 'react';
import './App.css';
import TextEntryModel from './models/TextEntryModel';

class App extends React.Component {
  state = {
    text: 'one line of text \nanother line of text',
  };
  model: TextEntryModel = new TextEntryModel();

  constructor(props: any) {
    super(props);
    this.model.setText(this.state.text);
  }

  changeText = (event: any) => {
    const text = event.target.value;
    this.model.setText(text);
    this.setState({ text: this.model.getText() });
  };

  render() {
    return (
      <div id="container">
        <div id="editor-container">
          <div id="gutter"/>
          <div id="editor">
            <textarea onChange={ this.changeText }/>
          </div>
        </div>
        <div id="other-stuff">
          { this.model.lines.map((line, i) =>
            <p>({ line.indentLevel }) - { line.text }</p>)
          }
        </div>
      </div>
    );
  }
}

export default App;
