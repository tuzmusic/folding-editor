import React from 'react';
import './App.css';

class App extends React.Component {
  state = {
    text: 'one line of text \nanother line of text',
  };

  get lines(): string[] {
    return this.state.text.split('\n');
  }

  changeText = (event: any) => {
    const text = event.target.value;
    this.setState({ text });
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
