import React from 'react';
import { HeaderNode, MarkdownNode } from "../models/MarkdownNode";
import styled from "@emotion/styled";

type Props = { node: MarkdownNode }

function renderNode(node: MarkdownNode) {
  const { tag, text } = node;
  const StyledNode = styled(tag)({
    ':hover': {
      textDecoration: node instanceof HeaderNode ? 'underline' : 'none',
    }
  });
  
  return <StyledNode>{ text }</StyledNode>;
}

const renderChildren = (node: HeaderNode) =>
  node.children.map((child, i) =>
    <NodeDisplay node={ child } key={ i }/>
  );

const NodeDisplay = ({ node }: Props) =>
  <div>
    { renderNode(node) }
    { node instanceof HeaderNode && renderChildren(node) }
  </div>;

export default NodeDisplay

