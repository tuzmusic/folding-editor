import React from 'react';
import styled from '@emotion/styled';
import { FullWidthFlexDiv } from "./StyledComponents";
import { FoldingDocument } from "../models/FoldingDocument";
import { basicStack1 } from "../models/__tests__/fixtures/twainStacks";
import MarkdownTreeView from "./MarkdownTreeView";
import SimpleTextEditView from "./SimpleTextEditView";
import { TwainTextNode } from "../models/types";

// region Subcomponents
const Container = styled(FullWidthFlexDiv)({
  flexDirection: 'column',
  height: '95vh',
  boxSizing: 'border-box',
});

// endregion
type State = {
  text: string
  markdown: TwainTextNode[]
  model: FoldingDocument
}

class App extends React.Component<any, State> {
  
  constructor(props: any) {
    super(props);
    const text = "";
    // const markdown = Twain(text).content.slice(1); // content[0] is "article"
    const markdown = basicStack1;
    const model = FoldingDocument.fromText(text);
    
    this.state = { text, markdown, model }
  }
  
  setModelText = (text: string) => {
    console.log(text);
    this.setState({ model: FoldingDocument.fromText(text) })
  };
  
  render = () => {
    const { text } = this.state.model;
    return (
      <Container>
        <SimpleTextEditView text={ text } setText={ this.setModelText }/>
        <MarkdownTreeView tree={ this.state.model.tree }/>
      </Container>
    );
  };
}

export default App;
