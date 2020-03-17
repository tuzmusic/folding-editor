import { FoldingDocument } from "./FoldingDocument";
import { HeaderTags } from "./MarkdownModel";
import { MarkdownNode } from "./MarkdownNode";
import { HeaderNode } from "./HeaderNode";
import { BodyNode } from "./BodyNode";

export const createMarkdownNode = (tag: string, text: string, document: FoldingDocument): MarkdownNode => {
  if (Object.keys(HeaderTags).includes(tag)) {
    return new HeaderNode(tag, text, document)
  } else /* if (Object.keys(ChildlessTags).includes(tag)) */ {
    return new BodyNode(tag, text, document)
  }
};
