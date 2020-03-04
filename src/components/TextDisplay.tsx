import React from 'react';
import styled from "@emotion/styled";
import { FullWidthFlexDiv } from "./StyledComponents";
import { TextLine } from "../models/TextEntryModel";
import TextLineComponent from "./TextLineComponent";

const Display = styled(FullWidthFlexDiv)({
  backgroundColor: 'white',
  boxSizing: 'border-box',
  height: '100%',
  flexDirection: 'column',
});

type Props = {
  lines: TextLine[]
}

class TextDisplay extends React.Component<Props> {

  render = () => {
    const { lines } = this.props;
    return (
      <Display>
        {
          lines.map((line, i) => {
            // canFold means this can be folded, which is dependent on the lines BELOW
            // a line can be folded if the NEXT line has a greater indent level
            let canFold = false;
            if (i < lines.length - 1) {
              const nextLine = lines[i + 1];
              if (nextLine.indentLevel > line.indentLevel) canFold = true;
            }
            return <TextLineComponent
              key={ i } line={ line } number={ i + 1 }
              canFold={ canFold }
            />;
          })
        }
      </Display>
    );
  };
}

export default TextDisplay;
