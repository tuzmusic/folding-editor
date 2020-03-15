//@ts-ignore

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
  h5 = "h5",
  h6 = "h6",
}

export type TwainTextChildNode = ["p", string] | string[];
export type TwainTextParentNode = ["h1" | "h2" | "h3" | "h4" | "h5" | "h6", string] | string[];
export type TwainTextNode = TwainTextChildNode | TwainTextParentNode
//endregion

const isHeaderNode = (node: MarkdownNode): boolean =>
  Object.keys(HeaderTags).includes(node.tag);
const isBodyNode = (node: MarkdownNode): boolean =>
  Object.keys(ChildlessTags).includes(node.tag);

/** @return lowest available parent on a node */
export function getLastParent(node: MarkdownNode): MarkdownNode {
  const lastHeaderChild = node.children.filter(n => isHeaderNode(n)).pop();
  // if node has children that can be parents, we've found our node.
  return lastHeaderChild ? getLastParent(lastHeaderChild) : node;
}

/** @return second character of a header tag, which is its level */
const headerLevel = (node: MarkdownNode): number => Number(node.tag[1]);

export function parseFlatTextTree(textStack: TwainTextNode[]): MarkdownStack {
  const markdownStack: MarkdownStack = [];
  
  function addChildNode(child: MarkdownNode, parent: MarkdownNode) {
    parent.children.push(child);
    child.parent = parent;
  }
  
  function addSiblingNode(nodeToAdd: MarkdownNode, destNode: MarkdownNode): void {
    if (destNode.parent) {
      addChildNode(nodeToAdd, destNode.parent);
      // return true;
    } else {
      markdownStack.push(nodeToAdd)
    }
    // return false;
  }
  
  function addHeaderNodeAfterHeaderNode(curr: MarkdownNode, prev: MarkdownNode): void {
    // BASE CASE 1
    if (headerLevel(prev) < headerLevel(curr))
      addChildNode(curr, prev);
    // BASE CASE 2
    if (headerLevel(prev) === headerLevel(curr))
      addSiblingNode(curr, prev);
    // RECURSION CASE
    if (headerLevel(prev) > headerLevel(curr))
      if (prev.parent)
        addHeaderNodeAfterHeaderNode(curr, prev.parent);
      else
        markdownStack.push(curr);  // is this right???
  }
  
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
    const lastParentNode = getLastParent(lastTextNode);
  
    if (isBodyNode(currentNode)) {
      // a body node gets added to the last available header
      // TODO: Is there a way to add a body as a younger sibling of a header???
      return addChildNode(currentNode, lastParentNode);
    }
  
    if (isHeaderNode(currentNode)) {
      return addHeaderNodeAfterHeaderNode(currentNode, lastParentNode);
    }
  
  });
  return markdownStack;
}
