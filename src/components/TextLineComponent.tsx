import React from 'react';
import styled from "@emotion/styled";
import { TextLine } from "../models/TextEntryModel";

const Line = styled.div({});

type Props = {
  line: TextLine
}

class TextLineComponent extends React.Component<Props> {
  
  render = () => (
    <Line>
      { this.props.line.text }
    </Line>
  )
}

export default TextLineComponent
