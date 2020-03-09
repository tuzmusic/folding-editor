//@ts-ignore
import Twain from 'mark-twain';

type MarkdownNode = {
  tag: string
  text: string
  children?: MarkdownNode[]
}

const parseNode = ([tag, content]: [string, any], tree: MarkdownNode[]): MarkdownNode => {
  // construct the node.

  // we'll always start with the tag name
  const node: Partial<MarkdownNode> = { tag };

  // if the content is just a string, we have a simple node
  if (typeof content === 'string') {
    node.text = content;
    // check our own indent-level table to determine nesting of nodes
  } else if (Array.isArray(content)) {

  }

  return node as MarkdownNode;
};

const createMarkdownTree = (text: string) => {
  // parse text into markdown tree with Mark Twain
  const startingTree: [string, any][] = Twain(text).content.slice(1); // remove content[0] which is "article"

  // create tree
  const tree: MarkdownNode[] = [];

  startingTree.forEach(node => {
    // construct the node, and its children (recursively)
    const parsedNode = parseNode(node, tree);
    tree.push(parsedNode);
  });

};
