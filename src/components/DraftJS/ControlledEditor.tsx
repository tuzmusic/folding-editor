import React, { useState } from 'react';
import { convertToRaw, EditorState, RawDraftContentBlock, RawDraftContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

const ControlledEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onEditorStateChange = (newState) => setEditorState(newState);
  
  /*
  This is where to get the model info from, from the raw content state.
  The array of blocks is flat, flatter than the markdown nodes, since lists
  are still given flat:
      0: {key: "9n3rb", text: "first header", type: "header-one", depth: 0, inlineStyleRanges: Array(0), …}
      1: {key: "eann4", text: "paragraph", type: "unstyled", depth: 0, inlineStyleRanges: Array(0), …}
      2: {key: "5jo54", text: "bullet", type: "unordered-list-item", depth: 0, inlineStyleRanges: Array(0), …}
      3: {key: "66van", text: "sub bullet", type: "unordered-list-item", depth: 1, inlineStyleRanges: Array(0), …}
      4: {key: "5s934", text: "sub sub bullet", type: "unordered-list-item", depth: 2, inlineStyleRanges:
  We could
  * */
  const rawContentState: RawDraftContentState = convertToRaw(editorState.getCurrentContent());
  const blocks: RawDraftContentBlock[] = rawContentState.blocks;
  // these are in the typedef as CoreDraftBlockType, but that's not exporting for some reason.
  const types: ("unstyled"
    | "paragraph"
    | "header-one"
    | "header-two"
    | "header-three"
    | "header-four"
    | "header-five"
    | "header-six"
    | "unordered-list-item"
    | "ordered-list-item"
    | "blockquote"
    | "code-block"
    | "atomic"
    | string)[] = blocks.map(b => b.type);
  
  window['raw'] = rawContentState.blocks;
  // console.log(blocks);
  
  const blockRen = (contentBlock) => {
    window['block'] = contentBlock;
    const text = contentBlock.getText();
    
    // This is basically the way to get at a block.
    // We still want to have some kind of access to the model
    // or SOME place where we can store a block's folded state
    
    if (text.endsWith('!')) {
      console.log("!!!!!!!");
      return {
        component: 'p',
        props: { children: ['!!!'] }
      };
    }
  };
  
  return (
    <Editor
      editorState={ editorState }
      wrapperClassName="demo-wrapper"
      editorClassName="demo-editor"
      onEditorStateChange={ onEditorStateChange }
      customBlockRenderFunc={ blockRen }
    />
  );
  
};

export default ControlledEditor;
