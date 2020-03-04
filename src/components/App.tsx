import React from 'react';
import TextEntryModel from '../models/TextEntryModel';
import styled from '@emotion/styled'
import { FullWidthFlexDiv } from "./StyledComponents";
import TextDisplay from "./TextDisplay";

// region
const Container = styled(FullWidthFlexDiv)({
  flexDirection: 'column',
  height: '95vh',
  boxSizing: 'border-box',
});

const EditorContainer = styled(FullWidthFlexDiv)({
  flex: 1,
  border: 'solid black thin',
});

const TextDisplayContainer = styled(FullWidthFlexDiv)({
  flex: 1,
  border: 'solid black thin',
});

const TextArea = styled.textarea({
  height: '100%',
  width: '100%',
  boxSizing: 'border-box',
  backgroundColor: 'transparent',
  border: 'none'
});

const EditorGutter = styled.div({
  backgroundColor: 'grey',
  width: '20px',
});

const Editor = styled.div({
  backgroundColor: 'lightgrey',
  flex: '10',
});

// endregion
const startingText =
  Array.from({ length: 20 }, (_, i) => {return `This is line #${ i + 1 }`}).join('\n');

// 'one line of text \nanother line of text';

class App extends React.Component {
  state = { text: startingText, };
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
  
  render = () => (
    <Container>
      <EditorContainer>
        <EditorGutter/>
        <Editor>
          <TextArea
            value={ this.state.text }
            onChange={ this.changeText }
          />
        </Editor>
      </EditorContainer>
      <TextDisplayContainer>
        <TextDisplay lines={ this.model.lines }/>
      </TextDisplayContainer>
    </Container>
  );
}

export default App;
