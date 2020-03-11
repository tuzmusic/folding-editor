//@ts-ignore
import Twain from 'mark-twain';

export type MarkdownStack = MarkdownNode[]
export type MarkdownNode = {
  tag: string
  text?: string
  children: MarkdownNode[]
  parent: MarkdownNode | null
}

enum ParentlessTags {
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

export function parseFlatTextTree(textStack: TwainTextNode[]): MarkdownStack {
  const markdownStack: MarkdownStack = [];
  
  function addtoPrevNodeParentIfAny(node: MarkdownNode, prevNode: MarkdownNode) {
    if (prevNode.parent) {
      prevNode.parent!.children.push(node);
    } else {
      markdownStack.push(node);
    }
  }
  
  while (textStack.length) {
    // get the first item from the tree
    const [tag, text] = textStack.shift()!;
    
    // this function only accepts text nodes
    // so we can initialize withtag and text
    const markdownNode: MarkdownNode = {
      tag,
      text,
      children: [],
      parent: null
    };
    
    // if this is the first node, add it and we're done
    if (markdownStack.length === 0) {
      markdownStack.push(markdownNode);
      continue;
    }
    
    const prevNode = markdownStack[markdownStack.length - 1];
    
    /*
    if this is the first node
      parent = null
      push onto stack
    else get previous node
    
    ADD_TO_PREVNODE_PARENT:
      if previous node has no parent
          add this node to stack
        else
          add this node to previous node's parent
        
    if this is a body node
      if previous node is a body node ADD_TO_PREVNODE_PARENT
    
    if this is a header node
      traverse the previous node's lineage
      when we find a parent whose header number is less than this header number
      add this node to that node's children
      if we never find such a parent
        add to the initial stack
    
    and then we're done? add node to stack, i guess?
    
    * */
    // assign the node's parent
    
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
