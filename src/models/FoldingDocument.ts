import { HeaderNode, MarkdownNode } from "./MarkdownNode";
import { TwainTextNode } from "./MarkdownModel";

export class FoldingDocument {
  sourceText: string = "";
  twainNodes: TwainTextNode[] = [];
  private nodes: MarkdownNode[] = []; // ALL nodes
  
  get tree(): MarkdownNode[] { return this.nodes.filter(node => !node.parent) }
  
  get lowestRoot(): HeaderNode | undefined {
    // step backward through the tree until we find a header node
    let reversedTree = [...this.tree].reverse();
    for (let node of reversedTree)
      if (node instanceof HeaderNode) return node as HeaderNode
  }
  
  static fromTwainNodes = (twainNodes: TwainTextNode[]) => {
    const doc = new FoldingDocument();
    doc.twainNodes = twainNodes;
    doc.parseTree();
    return doc;
  };
  
  addNode = (node: MarkdownNode) => this.nodes.push(node);
  
  parseTree = () => {
    this.twainNodes.forEach(([tag, text]) => {
      const node = MarkdownNode.create(tag, text, this);
  
      // get this BEFORE we add the current node (which could be the first node)
      const { lowestRoot } = this;
  
      // adds to ALL nodes
      // the rest of this method will assign children (parents),
      // which will indeed be "the tree", but the tree is simply
      // all the nodes who haven't been assigned parents
      // (which contain all the branches/leaves/child nodes, or are just single body nodes)
      // which is retrievable as this.tree
      this.nodes.push(node);
  
      // if there are roots on the tree, get the lowest root
      // and add this node as its lowest child.
      // note that this means that body nodes can only be added
      // at the root of the tree if there are no preceding roots.
      if (lowestRoot) {
        lowestRoot.addToLowestChild(node);
    
        /*        if (node instanceof BodyNode) {
                  lowestRoot.addChildNode(node) // assigns the parent
                } else if (node instanceof HeaderNode) {
                  // finds the appropriate parent **within the lastParentNode**
                  // and adds this node to its children, assigning this node's parent.
                  lowestRoot.addToLowestChild(node)
                }*/
      }
  
    })
  }
  
}
