import React from 'react';
import { ContentState, convertToRaw, EditorState, RawDraftContentBlock, RawDraftContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

const startText = `hi
bye
jonathan`;

const startingContent = ContentState.createFromText(startText);

const blockRen = (contentBlock) => {
  window['block'] = contentBlock;
  const text = contentBlock.getText();
  
  if (text.endsWith('!')) {
    return { component: () => null, };
  }
};

class DJEditor extends React.Component {
  state = {
    editorState: EditorState.createWithContent(startingContent)
    // editorState: EditorState.createEmpty();
  };
  
  onEditorStateChange = (newState) => this.setState({ editorState: newState });
  
  render() {
    const { editorState } = this.state;
    const { onEditorStateChange } = this;
    
    const rawContentState: RawDraftContentState = convertToRaw(editorState.getCurrentContent());
    const blocks: RawDraftContentBlock[] = rawContentState.blocks;
    window['raw'] = blocks;
    
    return (
      <Editor
        editorState={ this.state.editorState }
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={ onEditorStateChange }
        customBlockRenderFunc={ blockRen }
      />
    );
  }
}

export default DJEditor;
