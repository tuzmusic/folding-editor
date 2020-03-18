import React from 'react';
import { HeaderNode, MarkdownNode } from "../models/MarkdownNode";

type Props = { node: MarkdownNode }

function renderNode({ tag, text }: MarkdownNode) {
  // NODE: children can be COMPONENTS (which will be trees)
  return React.createElement(tag, { children: [text] });
}

const NodeDisplay = ({ node }: Props) => {
  console.log(node);
  const { tag, text } = node;
  const renderedChildren = (node instanceof HeaderNode) ? node.children.map((child, i) =>
    <NodeDisplay node={ child } key={ i }/>
  ) : null;
  
  return <>
    { renderNode(node) }
    { renderedChildren || null }
  </>
};

export default NodeDisplay
