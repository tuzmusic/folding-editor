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
11        p
12        h6
13    h1
    */
  `
    
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
;
