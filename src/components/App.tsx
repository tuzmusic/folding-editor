import React from 'react';
import TextEntryModel from '../models/TextEntryModel';
import styled from '@emotion/styled';
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
  border: 'none',
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
const startingText = [
  ...Array.from({ length: 20 }, (_, i) => `${ i % 5 }:This is line #${ i + 1 }`),
  '6:This line is really long. This line is really long. This line is really long. This line is really long. This line is really long. This line is really long. This line is really long. This line is really long. This line is really long. This line is really long. This line is really long. This line is really long. This line is really long. This line is really long. This line is really long. This line is really long.',
  '1:This is line after the really long line.',
].join('\n');

class App extends React.Component {
  state = { text: startingText, model: new TextEntryModel() };

  constructor(props: any) {
    super(props);
    this.state.model.setText(this.state.text);
  }

  changeText = (event: any) => {
    const text = event.target.value;
    this.state.model.setText(text);
    this.setState({ text: this.state.model.getText() });
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
        <TextDisplay
          lines={ this.state.model.lines }
          updateModel={ (model: TextEntryModel) => this.setState({ model }) }
        />
      </TextDisplayContainer>
    </Container>
  );
}

export default App;
