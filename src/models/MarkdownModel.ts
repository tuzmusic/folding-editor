//@ts-ignore
import Twain from 'mark-twain';

//region Types/Enums
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
//endregion

const isHeaderNode = (node: MarkdownNode): boolean =>
  Object.keys(HeaderTags).includes(node.tag);
const isBodyNode = (node: MarkdownNode): boolean =>
  Object.keys(ChildlessTags).includes(node.tag);

function addChildNode(child: MarkdownNode, parent: MarkdownNode) {
  parent.children.push(child);
  child.parent = parent;
}

function addSiblingNode(nodeToAdd: MarkdownNode, destNode: MarkdownNode): boolean {
  if (destNode.parent) {
    addChildNode(nodeToAdd, destNode.parent);
    return true;
  }
  return false;
}

/** @return latest available parent on a node */
export function getLastParent(node: MarkdownNode): MarkdownNode {
  const lastHeaderChild = node.children.filter(n => isHeaderNode(n)).pop();
  // if node has children that can be parents, we've found our node.
  return lastHeaderChild ? getLastParent(lastHeaderChild) : node;
}

// get second character of a header tag, which is its level
const headerLevel = (node: MarkdownNode): number => Number(node.tag[1]);

export function parseFlatTextTree(textStack: TwainTextNode[]): MarkdownStack {
  const markdownStack: MarkdownStack = [];
  
  textStack.forEach(([tag, text], i) => {
      // this function only accepts text nodes
      // so we can initialize with tag and text
      const currentNode: MarkdownNode = {
        tag,
        text,
        children: [],
        parent: null,
      };
      
      // assign the node's parent (or push it to the stack, with no parent)
      
      // if this is the first node, add it and we're done (no parent)
      if (i === 0) return markdownStack.push(currentNode);
      
      // get the last available parent node from the tree
      const lastTextNode = markdownStack[markdownStack.length - 1];
      const prevNode = getLastParent(lastTextNode);
      
      if (isBodyNode(currentNode) && isBodyNode(prevNode)) {
        // if the previous node doesn't accept children (i.e., it's a body node)
        // we can just add this node as a sibling of prev node
        return addSiblingNode(currentNode, prevNode) || markdownStack.push(currentNode);
      }
      
      if (isBodyNode(currentNode) && isHeaderNode(prevNode)) {
        // a body node following a header node
        // simply belongs under that header
        return addChildNode(currentNode, prevNode);
      }
      
      if (isHeaderNode(prevNode)) {
        if (isBodyNode(currentNode)) {
          // find the next header node (keep traversing)
        } else if (isHeaderNode(currentNode)) {
          /* This is probably the start of what will be extracted into a recursive function */
          const currentLevel = headerLevel(currentNode);
          const testLevel = headerLevel(prevNode);
          
          if (testLevel === currentLevel) {
            /* RECURSIVE BASE CASE (?) SUCCESS */
            // if they're the same level, add this node as a sibling of that node
            addSiblingNode(currentNode, prevNode);
          } else if (testLevel < currentLevel) {
            /* RECURSIVE BASE CASE (?) SUCCESS */
            // if the test node is less indented than our node,
            // we've found our parent!
            // add our node as a child of that node
            addChildNode(currentNode, prevNode);
          } else if (testLevel > currentLevel) {
            // if the test node is more indented than our node,
            // keep looking
          }
          // traverse the previous node's lineage
          // when we find a parent whose header number is less than
          // the CURRENT (?) header number
          // add this node to that node's children
          // if we never find such a parent
          // add to the initial stack
          
        }
        
        /* THIS MIGHT NOT BE RIGHT. OR, IT MIGHT BE RIGHT BUT ONLY FOR BODY NODE? */
        // if the prev node has no parent, we can add the current node to it
        // (we've reached the top level minus the stack itself)
        // if (!prevNode.parent) {
        //   addChildNode(currentNode, prevNode); // one recursive base case? (return prevNode)
        // }
        
        // traverse the previous node's lineage
        // when we find a parent whose header number is less than this header number
        // add this node to that node's children
        // if we never find such a parent
        // add to the initial stack
        
        // and then we're done? add node to stack, i guess?
        
      }
    }
  );
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
