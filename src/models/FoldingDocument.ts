import { MarkdownNode } from "./MarkdownNode";
import { TwainTextNode } from "./MarkdownModel";
import { HeaderNode } from "./HeaderNode";
import { BodyNode } from "./BodyNode";

export class FoldingDocument {
  sourceText: string = "";
  twainNodes: TwainTextNode[] = [];
  private nodes: MarkdownNode[] = []; // ALL nodes
  
  get tree(): MarkdownNode[] { return this.nodes.filter(node => !node.parent) }
  
  get lastParentNode(): HeaderNode | undefined {
    // step backward through the tree until we find a header node
    for (let node of [...this.tree].reverse())
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
      const node = new MarkdownNode(tag, text, this);
      
      // get this BEFORE we add the current node (which could be the first node)
      const { lastParentNode } = this;
      
      // adds to ALL nodes
      // the rest of this method will assign children (parents),
      // which will indeed be "the tree", but the tree is simply
      // all the nodes who haven't been assigned parents
      // (which contain all the branches/leaves/child nodes, or are just single body nodes)
      // which is retrievable as this.tree
      this.nodes.push(node);
      
      // if there's no header on the tree, this latest node can't have a parent,
      // so after we've added the node to the tree, we're done.
      if (!lastParentNode) return;
      
      if (node instanceof BodyNode) {
        lastParentNode.addChildNode(node) // assigns the parent
      } else if (node instanceof HeaderNode) {
        // finds the appropriate parent within the lastParentNode
        // and adds this node to its children, assigning this node's parent.
        node.addAfterHeaderNode(lastParentNode)
      }
    })
  }
  
}
