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
  updateModel: Function
}

class TextDisplay extends React.Component<Props> {

  render = () => {
    const { lines, updateModel } = this.props;
    return (
      <Display>
        {
          lines.map((line, i) => {
            // canFold means this can be folded, which is dependent on the lines BELOW
            // a line can be folded if the NEXT line has a greater indent level
            const nextLine = lines[i + 1];
            const canFold = nextLine?.indentLevel > line.indentLevel;
            return <TextLineComponent
              key={ i }
              line={ line }
              number={ i + 1 }
              folded={ line.folded }
              canFold={ canFold }
              updateModel={ updateModel }
            />;
          })
        }
      </Display>
    );
  };
}

export default TextDisplay;
