import React from 'react';
import TextEntryModel from '../models/TextEntryModel';
import styled from '@emotion/styled'
// region Subcomponents
const FullWidthFlexDiv = styled.div({
  display: 'flex',
  width: '100%',
});

const Container = styled(FullWidthFlexDiv)({
  flexDirection: 'column',
  height: '95vh',
  boxSizing: 'border-box',
});

const EditorContainer = styled(FullWidthFlexDiv)({
  flex: 1,
});

const TextDisplayContainer = styled(FullWidthFlexDiv)({
  flex: 1,
});

const TextArea = styled.textarea({
  height: '100%',
  width: '100%',
  boxSizing: 'border-box',
  backgroundColor: 'transparent',
  border: 'none'
});

const Display = styled(FullWidthFlexDiv)({
  backgroundColor: 'cyan',
  boxSizing: 'border-box',
  height: '100%',
  paddingLeft: '10px',
});

const EditorGutter = styled.div({
  backgroundColor: 'grey',
  width: '20px',
});

const DisplayGutter = styled.div({
  backgroundColor: 'black',
  width: '20px',
});

const Editor = styled.div({
  backgroundColor: 'lightgrey',
  flex: '10',
});

// endregion

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
      <Container>
        <EditorContainer id='editor-container'>
          <EditorGutter/>
          <Editor>
            <TextArea onChange={ this.changeText }/>
          </Editor>
        </EditorContainer>
        <TextDisplayContainer>
          <DisplayGutter/>
          <Display>
            { this.model.lines.map((line, i) =>
              <p>({ line.indentLevel }) - { line.text }</p>)
            }
          </Display>
        </TextDisplayContainer>
      </Container>
    );
  }
}

export default App;
