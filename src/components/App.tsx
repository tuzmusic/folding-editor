import React from 'react';
import styled from '@emotion/styled';
import { FullWidthFlexDiv } from "./StyledComponents";
import sampleText from '../fixtures/sample';
//@ts-ignore
import { FoldingDocument } from "../models/FoldingDocument";
import { MarkdownNode } from "../models/MarkdownNode";
import { TwainTextNode } from "../models/MarkdownModel";
import NodeDisplay from "./MarkdownNodeDisplay";
import { basicStack1 } from "../models/__tests__/twainStacks";

// region Subcomponents
const Container = styled(FullWidthFlexDiv)({
  flexDirection: 'column',
  height: '95vh',
  boxSizing: 'border-box',
});

const TextDisplayContainer = styled(FullWidthFlexDiv)({
  flex: 1,
  border: 'solid black thin',
  flexDirection: 'column',
  padding: '10px'
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
    const text = sampleText;
    // const markdown = Twain(text).content.slice(1); // content[0] is "article"
    const markdown = basicStack1;
    const model = FoldingDocument.fromTwainNodes(markdown);
    
    this.state = { text, markdown, model }
  }
  
  render = () => (
    <Container>
      <TextDisplayContainer>
        {
          this.state.model.tree.map((root: MarkdownNode, i) => {
            return <NodeDisplay node={ root } key={ i }/>
          })
        }
      </TextDisplayContainer>
    </Container>
  );
}

export default App;
