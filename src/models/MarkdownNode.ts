import { HeaderTags, } from "./MarkdownModel";
import { FoldingDocument } from "./FoldingDocument";

export class MarkdownNode {
  // tag = "";
  // text = ""; // todo: at some point we'll have to deal with parents without text (ol, ul, etc)
  // document: FoldingDocument | null = null;
  parent: HeaderNode | null = null;
  
  // note: make sure this constructor syntax works.
  // i think it's the only way to use document like an implicitly unwrapped optional
  // (that is, without having to declare it as FoldingDocument | null)
  constructor(public tag: string, public text: string, public document: FoldingDocument) {
    // this.tag = tag;
    // this.text = text;
    // this.document = document
  }
  
  static create(tag: string, text: string, document: FoldingDocument): MarkdownNode {
    if (Object.keys(HeaderTags).includes(tag)) {
      return new HeaderNode(tag, text, document)
    } else /* if (Object.keys(ChildlessTags).includes(tag)) */ {
      return new BodyNode(tag, text, document)
    }
  }
}

export class BodyNode extends MarkdownNode {
  text = "" as string // optional in superclass, required in Child
}

export class HeaderNode extends MarkdownNode {
  children: MarkdownNode[] = [];
  
  get headerLevel(): number {
    return Number(this.tag[1]);
  }
  
  // todo: this **recursive** function is a little different in
  //  this object oriented design. but it should still work?
  get lowestHeaderChild(): HeaderNode {
    const lowestHeaderChild = (this
      .children.filter(n => n instanceof HeaderNode) as HeaderNode[])
      .pop();
    // if node has children that can be parents, we've found our node.
    return lowestHeaderChild ? lowestHeaderChild.lowestHeaderChild : this;
  }
  
  addChildNode = (child: MarkdownNode) => {
    this.children.push(child);
    child.parent = this;
  };
  
  addSibling = (node: MarkdownNode): void => {
    if (this.parent) {
      this.parent.addChildNode(node);
    } else {
      // this.document.addNode(node)
    }
  };
  
  // recursively finds the lowest parent of given
  // node and adds this node as its child.
  addToLowestChild(node: MarkdownNode): void {
    if (node instanceof BodyNode)
      this.lowestHeaderChild.addChildNode(node);
    else if (node instanceof HeaderNode) {
      // BASE CASE 1
      if (this.headerLevel < node.headerLevel)
        if (node.headerLevel > this.lowestHeaderChild.headerLevel)
          this.lowestHeaderChild.addChildNode(node);
        else
          this.lowestHeaderChild.addSibling(node);
      // BASE CASE 2
      if (node.headerLevel === this.headerLevel)
        this.addSibling(node);
      // RECURSION CASE
      if (this.headerLevel > node.headerLevel)
        if (node.parent)
          this.addToLowestChild(node);
      // else
      //   this.document.addNode(this);
    }
  }
}
