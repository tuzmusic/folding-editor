import { HeaderTags, } from "./MarkdownModel";
import { HeaderNode } from "./HeaderNode";
import { BodyNode } from "./BodyNode";
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
