import React from 'react';
import styled from "@emotion/styled";
import { TextLine } from "../models/TextEntryModel";

const LineContainer = styled.div({
  display: 'flex',
});

const LineGutter = styled.div({
  display: 'inline-block',
  borderRight: 'solid thin black',
  minWidth: '25px',
  textAlign: 'center',
  paddingLeft: '4px',
  paddingRight: '4px',
  boxSizing: 'border-box',
});

const LineText = styled.div({
  display: 'inline',
  width: '100%',
  paddingLeft: '4px',
  paddingRight: '4px',
  boxSizing: 'border-box',
  whiteSpace: 'pre-wrap',
});

type Props = {
  line: TextLine
  number: number
}

const indentSpaces = 4;

class TextLineComponent extends React.Component<Props> {

  render = () => {
    const { line, number } = this.props;
    return (
      <LineContainer>
        <LineGutter>{ line.indentLevel }</LineGutter>
        <LineText>{ Array(line.indentLevel * indentSpaces).fill(' ').join('') + line.text }</LineText>
      </LineContainer>
    );
  };
}

export default TextLineComponent;
