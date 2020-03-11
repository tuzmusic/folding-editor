//@ts-ignore
import Twain from 'mark-twain';

export type MarkdownStack = MarkdownNode[]
export type MarkdownNode = {
  tag: string
  text?: string
  children: MarkdownNode[]
  parent: MarkdownNode | null
}

enum ChildlessTags {
  p = "p"
}

enum HeaderTags {
  h1 = "h1",
  h2 = "h2",
  h3 = "h3",
  h4 = "h4",
}

export type TwainTextChildNode = ["p", string] | string[];
export type TwainTextParentNode = ["h1" | "h2" | "h3" | "h4", string] | string[];
export type TwainTextNode = TwainTextChildNode | TwainTextParentNode

const isHeaderNode = (node: MarkdownNode): boolean =>
  Object.keys(HeaderTags).includes(node.tag);
const isBodyNode = (node: MarkdownNode): boolean =>
  Object.keys(ChildlessTags).includes(node.tag);

function addToPrevNodeParent(node: MarkdownNode, prevNode: MarkdownNode): boolean {
  if (prevNode.parent) {
    prevNode.parent!.children.push(node);
    node.parent = prevNode.parent;
    return true;
  }
  return false;
}

// get second character of a header tag, which is its level
const headerLevel = (node: MarkdownNode): number => Number(node.tag[1]);

export function parseFlatTextTree(textStack: TwainTextNode[]): MarkdownStack {
  const markdownStack: MarkdownStack = [];

  while (textStack.length) {
    // get the first item from the tree
    const [tag, text] = textStack.shift()!;

    // this function only accepts text nodes
    // so we can initialize with tag and text
    const currentNode: MarkdownNode = {
      tag,
      text,
      children: [],
      parent: null,
    };

    // assign the node's parent (or push it to the stack with no parent)

    // if this is the first node, add it and we're done
    if (markdownStack.length === 0) {
      markdownStack.push(currentNode);
      continue;
    }

    const prevNode = markdownStack[markdownStack.length - 1];

    // if the previous node doesn't accept children
    // we can just add this node as a sibling of prev node
    if (isBodyNode(prevNode)) {
      addToPrevNodeParent(currentNode, prevNode) || markdownStack.push(currentNode);
    } else if (isHeaderNode(prevNode)) {
      /*
if this is a header node
  traverse the previous node's lineage
  when we find a parent whose header number is less than this header number
  add this node to that node's children
  if we never find such a parent
    add to the initial stack

and then we're done? add node to stack, i guess?

* */

    }

    /*
    if this is the first node
      parent = null
      push onto stack
    else get previous node
     */
    /*
    ADD_TO_PREVNODE_PARENT:
      if previous node has no parent
          add this node to stack
        else
          add this node to previous node's parent
     */
    /*
    if this is a body node
      if previous node is a body node ADD_TO_PREVNODE_PARENT
     */

  }
  return markdownStack;
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
