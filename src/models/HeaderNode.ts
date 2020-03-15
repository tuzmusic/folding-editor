import { MarkdownNode } from "./MarkdownNode";

export class HeaderNode extends MarkdownNode {
  children: MarkdownNode[] = [];
  
  get headerLevel(): number { return Number(this.tag[0]); }
  
  // todo: this **recursive** function is a little different in
  //  this object oriented design. but it should still work?
  get lastParent(): HeaderNode {
    const lastHeaderChild = (this
      .children.filter(n => n instanceof HeaderNode) as HeaderNode[])
      .pop();
    // if node has children that can be parents, we've found our node.
    return lastHeaderChild ? lastHeaderChild.lastParent : this;
  }
  
  addChildNode = (child: MarkdownNode) => {
    this.children.push(child);
    child.parent = this;
  };
  
  addSiblingNode = (node: MarkdownNode): void => {
    if (this.parent) {
      this.addChildNode(node);
    } else {
      this.document.addNode(node)
    }
  };
  
  addAfterHeaderNode(prev: HeaderNode): void {
    // BASE CASE 1
    if (prev.headerLevel < this.headerLevel)
      prev.addChildNode(this);
    // BASE CASE 2
    if (prev.headerLevel === this.headerLevel)
      prev.addSiblingNode(this);
    // RECURSION CASE
    if (prev.headerLevel > this.headerLevel)
      if (prev.parent)
        this.addAfterHeaderNode(prev.parent);
      else
        this.document.addNode(this);
  }
}
