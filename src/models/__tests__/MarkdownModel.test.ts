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
  ;
