import DJNode from "./DJNode";
import { RawDraftContentBlock } from "draft-js";

export default class DJDoc {
  
  private nodes: DJNode[] = [];
  
  static fromBlocks(blocks: RawDraftContentBlock[]): DJDoc {
    const doc = new DJDoc();
    const nodes = blocks.map(block => DJNode.fromRaw(block));
    doc.nodes = nodes;
    return doc
  }
  
  getNodes(): DJNode[] { return this.nodes}
  
  getNodeByKey(key: string): DJNode | undefined {
    return this.nodes.find(node => node.key === key)
  }
}
