import React from 'react';
import styled from "@emotion/styled";
import { FullWidthFlexDiv } from "./StyledComponents";
import { TextLine } from "../models/TextEntryModel";
import TextLineComponent from "./TextLineComponent";

const Display = styled(FullWidthFlexDiv)({
  backgroundColor: 'white',
  boxSizing: 'border-box',
  height: '100%',
  flexDirection: 'column'
});

type Props = {
  lines: TextLine[]
}

class TextDisplay extends React.Component<Props> {
  
  render = () => (
    <Display>
      {
        this.props.lines.map(line =>
          <TextLineComponent line={ line }/>)
      }
    </Display>
  )
}

export default TextDisplay
