import DJDoc from "../../../components/DraftJS/DJDoc";
import { RawDraftContentBlock } from "draft-js";
import DJNode from "../../../components/DraftJS/DJNode";

const blocks: Partial<RawDraftContentBlock>[] = [
  { key: "9n3rb", text: "first header", type: "header-one", depth: 0 },
  { key: "eann4", text: "paragraph", type: "unstyled", depth: 0 },
  { key: "5jo54", text: "bullet", type: "unordered-list-item", depth: 0 },
  { key: "66van", text: "sub bullet", type: "unordered-list-item", depth: 1 },
  { key: "5s934", text: "sub sub bullet", type: "unordered-list-item", depth: 2 },
];

const nodes = [
  { key: "9n3rb", children: [] },
  { key: "eann4", children: [] },
  { key: "5jo54", children: [] },
  { key: "66van", children: [] },
  { key: "5s934", children: [] },
];

describe('DJNode', () => {
  it('can be constructed from a raw draft block', () => {
    const node = DJNode.fromRaw(blocks[0] as RawDraftContentBlock);
    expect(node).toEqual(nodes[0]);
  });
});

describe('DJDoc', () => {
  describe('fromBlocks', () => {
    it('takes raw blocks and stores them in a flat array of nodes', () => {
      const doc = DJDoc.fromBlocks(blocks as RawDraftContentBlock[]);
      expect(doc.getNodes()).toEqual(nodes)
    });
  });
  
  describe('getNodeByKey', () => {
    const doc = DJDoc.fromBlocks(blocks as RawDraftContentBlock[]);
    it('gets a node by key', () => {
      expect(doc.getNodeByKey('66van')?.key).toEqual('66van');
      expect(doc.getNodeByKey('eann4')?.key).toEqual('eann4');
    });
  });
});
