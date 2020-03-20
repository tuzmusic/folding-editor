import React, { useState } from 'react';
import { HeaderNode, MarkdownNode } from "../models/MarkdownNode";
import styled from "@emotion/styled";

type Props = {
  node: MarkdownNode
  indentLevel: number
}

const INDENT_SPACES = 4;

const renderChildren = (node: HeaderNode, indentLevel: number) =>
  node.children.map((child, i) =>
    <NodeDisplay node={ child } indentLevel={ indentLevel + 1 } key={ i }/>
  );

const Wrapper = styled.div({
  whiteSpace: 'pre-wrap',
  display: 'flex' // render spaces and text side-by-side
});

const NodeDisplay = ({ node, indentLevel }: Props) => {
  
  const { tag, text } = node;
  
  const [folded, setFolded] = useState(false);
  const toggleFolded = () => setFolded(!folded);
  
  const isHeader = node instanceof HeaderNode;
  const indentSpaces = Array(indentLevel * INDENT_SPACES).fill(' ').join('');
  
  const StyledNode = styled(tag)<{ indentLevel: number }>({
    ':hover': { textDecoration: isHeader ? 'underline' : 'none', }
  });
  
  return <>
    <Wrapper>
      <p>{ indentSpaces }</p> {/* spaces are same size regardless of main tag */ }
      <StyledNode indentLevel={ indentLevel } onClick={ toggleFolded }>
        { text }
      </StyledNode></Wrapper>
    { !folded && isHeader && renderChildren(node as HeaderNode, indentLevel) }
  </>;
};

export default NodeDisplay

