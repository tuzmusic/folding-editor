```ts
  const rawContentState: RawDraftContentState = convertToRaw(editorState.getCurrentContent());
  const blocks: RawDraftContentBlock[] = rawContentState.blocks;
```

This is where to generate the model info from, from the raw content state.
The array of blocks is flat, flatter than the markdown nodes, since lists
are still given flat: 
```
  0: {key: "9n3rb", text: "first header", type: "header-one", depth: 0, inlineStyleRanges: Array(0), …}
  1: {key: "eann4", text: "paragraph", type: "unstyled", depth: 0, inlineStyleRanges: Array(0), …}
  2: {key: "5jo54", text: "bullet", type: "unordered-list-item", depth: 0, inlineStyleRanges: Array(0), …}
  3: {key: "66van", text: "sub bullet", type: "unordered-list-item", depth: 1, inlineStyleRanges: Array(0), …}
  4: {key: "5s934", text: "sub sub bullet", type: "unordered-list-item", depth: 2, inlineStyleRanges: 
```

I'm pretty sure all we have to do is:
1. Use these blocks to generate the tree in a very similar way to how we do now.
2. Preserve the DraftJS-provided key in the nodes.
    - Can we only update the changed keys? 
3. Store folded-state in the node model.
    - Worry about how we perform the folding later. 
4. Write a (recursive!) MarkdownNode instance method, `getAllChildKeys: string[]`

In the custom block renderer (for each block):
```js
const node = FoldingDocument.getNodeByKey(contentBlock);
const key = node.key;

if (node.folded) {
    this.state.foldedParents.push(key); // maybe we don't even need this since we're already checking?
    this.state.foldedChildren.push(...node.getAllChildKeys);
    return <FoldedParentComponent block={contentBlock} />
} else if (this.state.foldedChildren.includes(key)) { // if this node is folded
    // don't render this component! (not as easy as it seems?) 
}

return null // causes the block to render as normal
```
I think the above is the fastest way to figure out whether a node is a folded child.
The alternative is to do have a (recursive) `isFoldedChild` instance method on a node, 
but that would have to be run on every node which seems inefficient.

I'm going to leave this here for now. This should take care of rendering the current state
of the model. Wiring up a UI for folding, communicating that to the model, using the component's 
state, is the next step.

I don't think it will be all that hard since we'll do it the way we currently do it, by creating a
new model every damn time we do anything. That's probably way too intensive! We should take a cue from
DraftJS itself and do it immutably (well actually the immutability might be what we're doing now?
but whatever they're doing to make it efficient we should take a cue from).

Of course what we really should be doing is somehow hooking into the blocks themselves and getting something
like our own state which is scaffolded on top of the DraftJS state. 
It just can't be a nested tree. That's the main reason we need our current model in the first place.   
