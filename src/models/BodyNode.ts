import { MarkdownNode } from "./MarkdownNode";

export class BodyNode extends MarkdownNode {
  text = "" as string // optional in superclass, required in Child
}
