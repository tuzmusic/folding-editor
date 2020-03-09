import React from 'react';
import styled from "@emotion/styled";

const LineContainer = styled.div({
  display: 'flex',
});

const LineGutter = styled.div<{ canFold?: boolean, folded?: boolean }>(({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRight: 'solid thin black',
  minWidth: '25px',
  textAlign: 'center',
  paddingLeft: '4px',
  paddingRight: '4px',
  boxSizing: 'border-box',
  userSelect: 'none',
}), ({ canFold, folded }) => ({
  color:
    folded ? 'red' : canFold ? 'black' : 'grey',
}));

const LineText = styled.div({
  display: 'inline',
  width: '100%',
  paddingLeft: '4px',
  paddingRight: '4px',
  boxSizing: 'border-box',
  whiteSpace: 'pre-wrap',
});

type Props = {
  line: string[]
  number: number
  // canFold: boolean
  // folded: boolean
  // updateModel: Function
}

const indentSpaces = 4;

class TextLineComponent extends React.Component<Props> {

  render = () => {
    const { line: [tag, content], number } = this.props;
    return (
      <LineContainer>
        <LineGutter
        >{ number }</LineGutter>
        <LineText>{
          React.createElement(tag, { children: content })   // recursion goes here!
        }</LineText>
      </LineContainer>
    );
  };
}

export default TextLineComponent;
