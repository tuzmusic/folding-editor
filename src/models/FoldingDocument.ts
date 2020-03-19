import { HeaderNode, MarkdownNode } from "./MarkdownNode";
import { TwainTextNode } from "./MarkdownModel";

export class FoldingDocument {
  sourceText: string = "";
  twainNodes: TwainTextNode[] = [];
  private nodes: MarkdownNode[] = []; // ALL nodes
  
  get tree(): MarkdownNode[] { return this.nodes.filter(node => !node.parent) }
  
  get lowestRoot(): HeaderNode | null {
    // step backward through the tree until we find a header node
    let reversedTree = [...this.tree].reverse();
    for (let node of reversedTree)
      if (node instanceof HeaderNode) return node as HeaderNode;
    return null;
  }
  
  static fromTwainNodes = (twainNodes: TwainTextNode[]) => {
    const doc = new FoldingDocument();
    doc.twainNodes = twainNodes;
    doc.parseTree(); // construct/populate all the nodes
    return doc;
  };
  
  parseTree = () => {
    this.twainNodes.forEach(([tag, text]) => {
      const node = MarkdownNode.create(tag, text, this);
  
      // get this BEFORE we add the current node (which could be the first node)
      const { lowestRoot } = this;
  
      // note that this is the list of all nodes,
      // as opposed to this.tree (which is only the roots)
      this.nodes.push(node);
  
      // get the lowest root, if there is one,
      // and add this node as its lowest child.
      // note: for a root node, this will actually "fall through"
      // and do nothing (in node.addSibling)
      lowestRoot?.addToLowestHeaderChild(node);
    })
  }
  
}
