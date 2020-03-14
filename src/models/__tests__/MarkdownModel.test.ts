import { MarkdownNode, MarkdownStack, parseFlatTextTree, TwainTextNode } from "../MarkdownModel";

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
    // the completely flattened series of indent levels
    /*
    h1
      h2
        h3
    h1
      h3
        p
      h2
        p
        p
        p
      h2
        h6
        p
    h1
    */
    const levels = [1, 2, 3, 1, 3, 0, 2, 0, 0, 2, 6, 0, 1];
    const stack: TwainTextNode[] = levels.map(num => {
      const tag = num === 0 ? "p" : `h${ num }`;
      return [tag, `this is a ${ tag }`]
    });
    
    const tree = parseFlatTextTree(stack);
    expect(tree.length).toEqual(3);
    
    const [h1a, h1b, h1c] = tree;
    
    expect(h1a.children.length).toEqual(1);
    expect(h1b.children.length).toEqual(3);
    
    expect(h1a.children[0].parent).toEqual(h1a);
    expect(h1a.children[0].children.length).toEqual(1);
    expect(h1a.children[0].children[0].tag).toEqual("p");
    expect(h1a.children[0].children[0].children.length).toEqual(0);
    
    const [h3a, h2b, h2c] = h1b.children;
    expect(h3a.children.length).toEqual(1);
    expect(h2b.children.length).toEqual(3);
    expect(h2c.children.length).toEqual(2);
    expect(h2c.children[0].tag).toEqual("h6");
    expect(h2c.children[0].children.length).toEqual(0);
    
    expect(h1c.children.length).toEqual(0);
  })
});
