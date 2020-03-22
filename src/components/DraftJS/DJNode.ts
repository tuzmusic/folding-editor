import { RawDraftContentBlock } from "draft-js";

export default class DJNode {
  key: string = "";
  children: DJNode[] = [];
  parent?: DJNode;
  
  static fromRaw(block: RawDraftContentBlock): DJNode {
    const node = new DJNode();
    node.key = block.key;
    return node
  }
}
