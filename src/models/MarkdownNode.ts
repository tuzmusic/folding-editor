import { FoldingDocument } from "./FoldingDocument";
import { HeaderTags } from "./MarkdownModel";

export class MarkdownNode {
  // tag = "";
  // text = ""; // todo: at some point we'll have to deal with parents without text (ol, ul, etc)
  // document: FoldingDocument | null = null;
  parent: HeaderNode | null = null;
  
  constructor(public tag: string, public text: string, public document: FoldingDocument) {}
  
  // note: because this calls its subclasses, which of course reference this class,
  // these 3 classes must be in the same file to avoid circular imports in multiple files.
  // there may be a way to fix this by defining this function in its own file,
  // but that's actually also a challenge.
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
  
  get headerLevel(): number { return Number(this.tag[1]); }
  
  get lowestHeaderChild(): HeaderNode {
    const lowestHeaderChild = (this
      .children.filter(n => n instanceof HeaderNode) as HeaderNode[])
      .pop(); // get the last one
    if (!lowestHeaderChild) return this; // BASE CASE
    return lowestHeaderChild.lowestHeaderChild // RECURSION CASE
  }
  
  addChildNode = (child: MarkdownNode) => {
    this.children.push(child);
    child.parent = this;
  };
  
  addSibling = (node: MarkdownNode): void => this.parent?.addChildNode(node);
  
  // recursively finds the lowest parent of given
  // node and adds this node as its child.
  addToLowestHeaderChild(node: MarkdownNode): void {
    if (node instanceof BodyNode)
      this.lowestHeaderChild.addChildNode(node);
    else if (node instanceof HeaderNode) {
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
      /* THIS ISN'T NEEDED! THAT MEANS THERE'S NO RECURSION!! WHAT?!?!? */
      /* Well, we always call this on a root.
      * Nothing has a lower header level than a root. todo: <--- THIS DEPENDS ON WHAT THE ROOT IS!
      * The recursion only happens inside of this.lowestHeaderChild.
      * Theoretically this probably means we could have written that method's
      * recursion into this one. But hey, look at the name of this method anyway!
      * todo: does this break separation of concerns?
      *  (node shouldn't know how its document builds itself?)
      *  (which would mean we keep the recursion?)
      *  (as well as the deleted case of !this.parent,
      *   which perhaps could return false instead of dealing
      *   with it directly)
      * */
      // RECURSION CASE
      // if (this.headerLevel > node.headerLevel)
      //   this.addToLowestChild(node);
    }
  }
}
