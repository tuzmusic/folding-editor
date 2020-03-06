import React from 'react';
import styled from "@emotion/styled";
import { TextLine } from "../models/TextEntryModel";

const LineContainer = styled.div({
  display: 'flex',
});

const LineGutter = styled.div<{ canFold: boolean, folded: boolean }>(({
  display: 'inline-block',
  borderRight: 'solid thin black',
  minWidth: '25px',
  textAlign: 'center',
  paddingLeft: '4px',
  paddingRight: '4px',
  boxSizing: 'border-box',
  userSelect: 'none',
}), ({ canFold, folded }) => ({ color: canFold ? 'red' : (folded ? 'blue' : 'black') }));

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
  canFold: boolean
  folded: boolean
  updateModel: Function
}

const indentSpaces = 4;

class TextLineComponent extends React.Component<Props> {
  foldLine = () => {
    const { line, updateModel } = this.props;
    line.fold();
    updateModel(line.model);
  };

  render = () => {
    const { line, canFold, folded, updateModel } = this.props;
    return (
      <LineContainer>
        <LineGutter
          canFold={ canFold }
          folded={ folded }
          onClick={ canFold ? this.foldLine : () => {} }
        >{ line.indentLevel }</LineGutter>
        <LineText>{
          folded ? "..." :
            Array(line.indentLevel * indentSpaces).fill(' ').join('') + line.text
        }</LineText>
      </LineContainer>
    );
  };
}

export default TextLineComponent;
