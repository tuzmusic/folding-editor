import React from 'react';
import './App.css';
import TextEntryModel from './models/TextEntryModel';

class App extends React.Component {
  state = {
    // text: 'one line of text \nanother line of text',
    text: '',
  };

  get lines(): string[] {
    return this.state.text.split('\n');
  }

  changeText = (event: any) => {
    const text = event.target.value;
    const model = new TextEntryModel();
    model.setText(text);
    this.setState({ text: model.getText() });
  };

  render() {
    return (
      <div id="container">
        <div id="editor-container">
          <div id="gutter"/>
          <div id="editor">
          <textarea
            value={ this.state.text }
            onChange={ this.changeText }
          />
          </div>
        </div>
        <div id="other-stuff">
          { this.lines.map(line =>
            <p>{ line.length } - { line }</p>)
          }
        </div>
      </div>
    );
  }
}

export default App;
