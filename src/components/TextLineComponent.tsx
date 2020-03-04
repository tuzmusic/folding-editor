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
  number: number
}

class TextLineComponent extends React.Component<Props> {
  
  render = () => {
    const { line, number } = this.props;
    return (
      <Line>
        <LineGutter>{ number }</LineGutter>
        <LineText>{ line.text }</LineText>
      </Line>
    );
  }
}

export default TextLineComponent
