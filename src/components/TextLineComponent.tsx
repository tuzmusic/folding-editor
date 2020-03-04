import React from 'react';
import styled from "@emotion/styled";
import { TextLine } from "../models/TextEntryModel";

const Line = styled.div({});
const LineText = styled.span({
  width: '100%',
  paddingLeft: '4px',
  paddingRight: '4px',
  boxSizing: 'border-box'
});

const LineGutter = styled.span({
  borderRight: 'solid thin black',
  width: '25px',
  paddingLeft: '4px',
  paddingRight: '4px',
  boxSizing: 'border-box'
});

type Props = {
  line: TextLine
}

class TextLineComponent extends React.Component<Props> {
  
  render = () => (
    <Line>
      <LineGutter>##</LineGutter>
      <LineText>{ this.props.line.text }</LineText>
    </Line>
  )
}

export default TextLineComponent
