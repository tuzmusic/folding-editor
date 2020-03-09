import React from 'react';
import TextEntryModel from '../models/TextEntryModel';
import styled from '@emotion/styled';
import { FullWidthFlexDiv } from "./StyledComponents";
import TextDisplay from "./TextDisplay";
import sampleText from '../fixtures/sample';
//@ts-ignore
import Twain from 'mark-twain';

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
  flexDirection: 'column',
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

class App extends React.Component {
  state = { text: sampleText, model: new TextEntryModel(), markdown: [] as any[] };

  constructor(props: any) {
    super(props);
    this.state.model.setText(this.state.text);
    this.state.markdown = Twain(sampleText).content.slice(1); // content[0] is "article"
    console.log(this.state.markdown);
  }

  changeText = (event: any) => {
    const text = event.target.value;
    this.state.model.setText(text);
    this.setState({ text: this.state.model.getText() });
  };

  render = () => (
    <Container>
      {/* <EditorContainer>
        <EditorGutter/>
        <Editor>
          <TextArea
            value={ this.state.text }
            onChange={ this.changeText }
          />
        </Editor>
      </EditorContainer>*/ }
      <TextDisplayContainer>
        <TextDisplay lines={ this.state.markdown }/>
      </TextDisplayContainer>
    </Container>
  );
}

export default App;
