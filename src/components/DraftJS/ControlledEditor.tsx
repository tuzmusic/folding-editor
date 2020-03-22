import React, { useState } from 'react';
import { convertToRaw, EditorState, RawDraftContentBlock, RawDraftContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

const ControlledEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onEditorStateChange = (newState) => setEditorState(newState);
  
  const rawContentState: RawDraftContentState = convertToRaw(editorState.getCurrentContent());
  const blocks: RawDraftContentBlock[] = rawContentState.blocks;
  window['raw'] = blocks;
  
  const blockRen = (contentBlock) => {
    window['block'] = contentBlock;
    const text = contentBlock.getText();
    
    if (text.endsWith('!')) {
      return { component: () => null, };
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
