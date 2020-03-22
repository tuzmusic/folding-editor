import DJNode, { DJContainerNode } from "./DJNode";
import { RawDraftContentBlock } from "draft-js";

export default class DJDoc {
  
  private nodes: DJNode[] = [];
  
  public get tree(): DJNode[] { return this.nodes.filter(node => !node.parent) }
  
  private get lowestRoot(): DJContainerNode | null {
    // step backward through the tree until we find a header node
    let reversedTree = [...this.tree].reverse();
    for (let node of reversedTree)
      if (node instanceof DJContainerNode)
        return node as DJContainerNode;
    // if we didn't find one, return null
    return null;
  }
  
  static fromBlocks(blocks: RawDraftContentBlock[]): DJDoc {
    const doc = new DJDoc();
    const nodes = blocks.map(block => DJNode.fromRaw(block));
    doc.parseTree(nodes);
    return doc;
  }
  
  parseTree(nodes) {
    nodes.forEach(node => {
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
  
  getNodes(): DJNode[] { return this.nodes}
  
  getNodeByKey(key: string): DJNode | undefined {
    return this.nodes.find(node => node.key === key)
  }
}
