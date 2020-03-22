import { RawDraftContentBlock } from "draft-js";

export default class DJNode {
  key: string = "";
  parent?: DJContainerNode;
  type: string = ""; // todo: type should be narrowed
  
  static fromRaw(block: RawDraftContentBlock): DJNode {
    let node: DJNode;
    if (block.type.startsWith("header")) {
      node = new DJContainerNode()
    } else {
      node = new DJNode()
    }
    
    node.key = block.key;
    node.type = block.type;
    
    return node
  }
}

export class DJContainerNode extends DJNode {
  children: DJNode[] = [];
  
  get headerLevel(): number {
    const numbers = [
      "paragraph",
      "header-one",
      "header-two",
      "header-three",
      "header-four",
      "header-five",
      "header-six",
    ];
    
    return numbers.indexOf(this.type);
  }
  
  get lowestHeaderChild(): DJContainerNode {
    const lowestHeaderChild = (this
      .children.filter(n => n instanceof DJContainerNode) as DJContainerNode[])
      .pop(); // get the last one
    if (!lowestHeaderChild) return this; // BASE CASE
    return lowestHeaderChild.lowestHeaderChild // RECURSION CASE
  }
  
  addChildNode = (child: DJNode) => {
    this.children.push(child);
    child.parent = this;
  };
  
  addSibling = (node: DJNode): void => this.parent?.addChildNode(node);
  
  // recursively finds the lowest parent of given
  // node and adds this node as its child.
  addToLowestHeaderChild(node: DJNode): void {
    if (!(node instanceof DJContainerNode))
      this.lowestHeaderChild.addChildNode(node);
    else if (node instanceof DJContainerNode) {
      // BASE CASE
      if (node.headerLevel === this.headerLevel)
        this.addSibling(node);
      // BASE CASE
      if (this.headerLevel < node.headerLevel)
        if (node.headerLevel > this.lowestHeaderChild.headerLevel)
          this.lowestHeaderChild.addChildNode(node);
        else
          // if we're not adding a child, we basically ignore header
          // level, and just add this node at the same level
          this.lowestHeaderChild.addSibling(node);
    }
  }
  
}

