import { MarkdownNode, MarkdownStack, parseFlatTextTree, TwainTextNode } from "../MarkdownModel";
import { FoldingDocument } from "../FoldingDocument";
import { HeaderNode } from "../MarkdownNode";
import { basicStack1 } from "./twainStacks";

type LooseMarkdownStack = Partial<MarkdownNode>[]

const simpleNodes = (nodes: Partial<MarkdownNode>[]): MarkdownStack => nodes.map(node => {
    return { ...node, parent: null, children: [] } as MarkdownNode;
  }
);

describe('flat tree creation', () => {
  it('pushes any item onto an empty stack', () => {
    const singleItemStack: TwainTextNode[] = [
      ["p", "only line"]
    ];
    const expected: LooseMarkdownStack =
      simpleNodes([{ tag: "p", text: "only line" }]);
  
    expect(parseFlatTextTree(singleItemStack)).toEqual(expected);
  });
  
  it('can parse a simple tree of body elements', () => {
    const textStack: TwainTextNode[] = [
      ["p", "first line"],
      ["p", "second line"],
      ["p", "third line"],
    ];
    const markdownStack: MarkdownStack = simpleNodes([
      { tag: "p", text: "first line" },
      { tag: "p", text: "second line" },
      { tag: "p", text: "third line" },
    ]);
    
    expect(parseFlatTextTree(textStack)).toEqual(markdownStack);
  });
  
  it('can parse headers', () => {
    const headerStack: TwainTextNode[] = [
      ["h1", "header 1"],
      ["h2", "header 2"],
      ["p", "text"],
    ];
    
    const parsed = parseFlatTextTree(headerStack);
    expect(parsed.length).toEqual(1);
    
    const h1 = parsed[0];
    expect(h1.children.length).toEqual(1);
    const h2 = h1.children[0];
    expect(h2.parent).toEqual(h1);
    expect(h2.children.length).toEqual(1);
    const p = h2.children[0];
    expect(p.parent).toEqual(h2);
    
  });
  
  it('can parse more complex trees', () => {
    // todo: can markdown actually create this tree? (I think so)
    // the completely flattened series of indent levels
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
12        p
11        h6
13    h1
    */
    const levels = [1, 2, 3, 1, 3, 0, 2, 0, 0, 0, 2, 0, 6, 1];
    const stack: TwainTextNode[] = levels.map((num, i) => {
      const tag = num === 0 ? "p" : `h${ num }`;
      return [tag, `${ i }. this is a ${ tag }`]
    });
  
    const tree = parseFlatTextTree(stack);
    expect(tree.length).toEqual(3);
  
    const [h1a, h1b, h1c] = tree;
    const [h3a, h2b, h2c] = h1b.children;
    
    expect(h1a.children.length).toEqual(1);
    expect(h1b.children.length).toEqual(3);
  
    expect(h1a.children[0].parent).toEqual(h1a);
    expect(h1a.children[0].children.length).toEqual(1);
    expect(h1a.children[0].children[0].tag).toEqual("h3");
    expect(h1a.children[0].children[0].children.length).toEqual(0);
  
    expect(h3a.children.length).toEqual(1);
    expect(h2b.children.length).toEqual(3);
    expect(h2c.children.length).toEqual(2);
    expect(h2c.children[1].tag).toEqual("h6");
    expect(h2c.children[1].children.length).toEqual(0);
  
    expect(h1c.children.length).toEqual(0);
  })
  
});

describe('object oriented', () => {
  it('OBJECT-ORIENTED: can parse more complex trees', () => {
    // todo: can markdown actually create this tree? (I think so)
    // the completely flattened series of indent levels
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
12        p
11        h6
13    h1
    */
  
    const doc = FoldingDocument.fromTwainNodes(basicStack1);
    const tree = doc.tree;
    expect(tree.length).toEqual(3);
  
    expect(
      doc['nodes'].every(node => node.text != "")
    ).toBe(true);
  
    const [h1a, h1b, h1c] = tree as HeaderNode[];
    const [h3a, h2b, h2c] = h1b.children as HeaderNode[];
  
    expect(h1a.children.length).toEqual(1);
    expect(h1b.children.length).toEqual(3);
  
    let h1aChild = h1a.children[0] as HeaderNode;
    expect(h1aChild).toBeInstanceOf(HeaderNode);
    expect(h1aChild.parent).toEqual(h1a);
    expect(h1aChild.children.length).toEqual(1);
    
    let h1aChildChild = h1aChild.children[0] as HeaderNode;
    expect(h1aChildChild.tag).toEqual("h3");
    expect(h1aChildChild.children.length).toEqual(0);
    
    expect(h3a.children.length).toEqual(1);
    expect(h2b.children.length).toEqual(3);
    expect(h2c.children.length).toEqual(2);
    expect(h2c.children[1].tag).toEqual("h6");
    expect((h2c.children[1] as HeaderNode).children.length).toEqual(0);
    
    expect(h1c.children.length).toEqual(0);
  })
  
});
