import React from 'react';
import styled from "@emotion/styled";
import { FullWidthFlexDiv } from "./StyledComponents";
import TextLineComponent from "./TextLineComponent";

const Display = styled(FullWidthFlexDiv)({
  backgroundColor: 'white',
  boxSizing: 'border-box',
  height: '100%',
  flexDirection: 'column',
});

type Props = {
  lines: string[][]
  // updateModel: Function
}

class TextDisplay extends React.Component<Props> {

  render = () => {
    const { lines } = this.props;
    return (
      <Display>
        {
          lines.map((line, i) =>
            <TextLineComponent key={ i } line={ line } number={ i + 1 }/>)
        }
      </Display>
    );
  };
}

export default TextDisplay;
