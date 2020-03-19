import React, { useState } from 'react';
import { HeaderNode, MarkdownNode } from "../models/MarkdownNode";
import styled from "@emotion/styled";

type Props = {
  node: MarkdownNode
  indentLevel: number
}

const renderChildren = (node: HeaderNode, indentLevel: number) =>
  node.children.map((child, i) =>
    <NodeDisplay node={ child } indentLevel={ indentLevel + 1 } key={ i }/>
  );

const NodeDisplay = ({ node, indentLevel }: Props) => {
  
  const [folded, setFolded] = useState(false);
  const { tag, text } = node;
  
  const toggleFolded = () => setFolded(!folded);
  
  const StyledNode = styled(tag)<{ indentLevel: number }>(({
    ':hover': {
      textDecoration: node instanceof HeaderNode ? 'underline' : 'none',
    }
  }), ({ indentLevel }) => ({ marginLeft: indentLevel * 10 }));
  
  return <div>
    <StyledNode indentLevel={ indentLevel } onClick={ toggleFolded }>
      { text }
    </StyledNode>
    { !folded && node instanceof HeaderNode && renderChildren(node, indentLevel) }
  </div>;
};

export default NodeDisplay

