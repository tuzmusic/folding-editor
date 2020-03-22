import DJDoc from "../../../components/DraftJS/DJDoc";
import { RawDraftContentBlock } from "draft-js";
import DJNode, { DJContainerNode } from "../../../components/DraftJS/DJNode";

describe('tree: headers and paragraphs only', () => {
  /*
00    h1
01      h2
02        h3
03    h1
04      h3
05        p
06      h2   <-- still comes after the h3, as its sibling
07        p
08        p
09        p
10      h2
11        p
12        h6
13    h1
*/
  const levels = [1, 2, 3, 1, 3, 0, 2, 0, 0, 0, 2, 0, 6, 1];
  const orderedTags = [
    "paragraph",
    "header-one",
    "header-two",
    "header-three",
    "header-four",
    "header-five",
    "header-six",
  ];
  
  const blocks = levels.map((n, i) => ({
    key: i.toString(),
    type: orderedTags[n]
  })) as RawDraftContentBlock[];
  
  const doc = DJDoc.fromBlocks(blocks);
  const tree = doc.tree;
  
  describe('parseTree', () => {
    it('creates a tree', () => {
      expect(tree.length).toEqual(3);
      
      const [h1a, h1b, h1c] = tree as DJContainerNode[];
      const [h3a, h2b, h2c] = h1b.children as DJContainerNode[];
      
      expect(h1a.children.length).toEqual(1);
      expect(h1b.children.length).toEqual(3);
      
      let h1aChild = h1a.children[0] as DJContainerNode;
      expect(h1aChild.parent).toEqual(h1a);
      expect(h1aChild.children.length).toEqual(1);
      
      let h1aChildChild = h1aChild.children[0] as DJContainerNode;
      expect(h1aChildChild.key).toEqual("2");
      expect(h1aChildChild.type).toEqual("header-three");
      expect(h1aChildChild.children.length).toEqual(0);
      
      expect(h3a.children.length).toEqual(1);
      expect(h2b.children.length).toEqual(3);
      expect(h2c.children.length).toEqual(2);
      const h2cChild = h2c.children[1] as DJContainerNode;
      expect(h2cChild.key).toEqual("12");
      expect(h2cChild.type).toEqual("header-six");
      expect((h2cChild).children.length).toEqual(0);
      
      expect(h1c.children.length).toEqual(0);
    });
  });
  
  describe('getAllChildKeys', () => {
    const h1a = tree[1] as DJContainerNode;
    
    const childKeys = [4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => n.toString());
    it('gets the keys of the children of a node', () => {
      expect(h1a.getAllChildKeys()).toEqual(childKeys);
    });
  });
  
});

describe('basic model', () => {
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
      expect(node).toMatchObject(nodes[0]);
    });
  });
  
  describe('DJDoc', () => {
    describe('fromBlocks', () => {
      it('takes raw blocks and stores them in a flat array of nodes', () => {
        const doc = DJDoc.fromBlocks(blocks as RawDraftContentBlock[]);
        expect(doc.getNodes().map(n => n.key)).toEqual(blocks.map(b => b.key))
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
});
