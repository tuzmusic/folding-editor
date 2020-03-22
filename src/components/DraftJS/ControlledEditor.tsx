import React from 'react';
import { ContentState, convertToRaw, EditorState, RawDraftContentState, SelectionState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import DJDoc from "./DJDoc";
import { DJContainerNode } from "./DJNode";

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

type Props = {};
type State = {
  editorState: EditorState
  documentModel: DJDoc
  foldedParents: { [parentKey: string]: string[] }
}

class DJEditor extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const editorState = EditorState.createWithContent(startingContent);
    const documentModel = DJDoc.fromEditorState(editorState);
    this.state = { editorState, documentModel, foldedParents: {} };
  }
  
  get allFoldedChilrenKeys(): string[] { return Object.values(this.state.foldedParents).flat() }
  
  get foldedParentKeys(): string[] { return Object.keys(this.state.foldedParents) }
  
  get rawContentState(): RawDraftContentState {
    return convertToRaw(this.state.editorState.getCurrentContent());
  }
  
  get selection(): SelectionState {
    return this.state.editorState.getSelection();
  }
  
  updateState = (newEditorState: EditorState) => {
    const newModelState = DJDoc.fromEditorState(newEditorState);
    this.setState({ editorState: newEditorState, documentModel: newModelState });
  };
  
  foldAtCursor() {
    // this function is for folding at a single cursor position
    // todo: it should actually be pretty easy to implement foldSelection()
    if (!this.selection.isCollapsed()) return;
    const anchorKey = this.selection.getAnchorKey();
    const node = this.state.documentModel.getNodeByKey(anchorKey);
    if (!(node instanceof DJContainerNode)) return;
    
    const parentNode = node as DJContainerNode;
    
    this.setState(({ foldedParents }) => {
      if (this.foldedParentKeys.includes(anchorKey)) { // UNFOLD
        delete foldedParents[anchorKey]
      } else { // FOLD
        foldedParents[anchorKey] = parentNode.getAllChildKeys()
      }
      return { foldedParents }
    })
  }
  
  render() {
    const { editorState } = this.state;
    const { updateState } = this;
    window['fold'] = this.foldAtCursor.bind(this);
    window['raw'] = this.rawContentState.blocks;
    window['model'] = this.state.documentModel;
    window['edstate'] = editorState;
    window['selection'] = this.selection;
    return (
      <Editor
        editorState={ this.state.editorState }
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={ updateState }
        customBlockRenderFunc={ blockRen }
      />
    );
  }
}

export default DJEditor;
