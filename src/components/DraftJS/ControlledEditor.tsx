import React from 'react';
import { ContentState, convertToRaw, EditorState, RawDraftContentState, SelectionState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import DJDoc from "./DJDoc";
import { DJContainerNode } from "./DJNode";
import styled from '@emotion/styled';

const startText = `h1 
p content
h2
p content
h1
p content`;

const startingContent = ContentState.createFromText(startText);

const InvisibleBlock = styled.div({});
const FoldButton = styled.div({
  borderRadius: '50px',
  background: 'lightblue',
  position: 'absolute',
  bottom: 0,
  left: 0,
  margin: '20px',
  padding: '20px',
  height: '50px',
  width: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

type Props = {};
type State = {
  editorState: EditorState
  documentModel: DJDoc
  foldedParents: { [parentKey: string]: string[] }
}

class DJEditor extends React.Component<Props, State> {
  get allFoldedChildrenKeys(): string[] { return Object.values(this.state.foldedParents).flat(); }

  constructor(props) {
    super(props);
    const editorState = EditorState.createWithContent(startingContent);
    const documentModel = DJDoc.fromEditorState(editorState);
    this.state = { editorState, documentModel, foldedParents: {} };
  }

  get foldedParentKeys(): string[] { return Object.keys(this.state.foldedParents); }

  render() {
    const { editorState } = this.state;
    const { updateState, blockRen, foldAtCursor } = this;
    this.bindToWindow(); // make lots of useful stuff accessible to the console

    return (
      <>
        <FoldButton onClick={ foldAtCursor }>
          Fold
        </FoldButton>
        <Editor
          editorState={ editorState }
          wrapperClassName="wrapper"
          editorClassName="editor"
          onEditorStateChange={ updateState }
          customBlockRenderFunc={ blockRen }
        /></>
    );
  }

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

  foldAtCursor = () => {
    // this function is for folding at a single cursor position
    // todo: it should actually be pretty easy to implement foldSelection()
    if (!this.selection.isCollapsed()) return;
    const anchorKey = this.selection.getAnchorKey();
    const node = this.state.documentModel.getNodeByKey(anchorKey);
    if (!(node instanceof DJContainerNode)) return;

    const parentNode = node as DJContainerNode;

    this.setState(({ foldedParents }) => {
      if (this.foldedParentKeys.includes(anchorKey)) { // UNFOLD
        delete foldedParents[anchorKey];
      } else { // FOLD
        foldedParents[anchorKey] = parentNode.getAllChildKeys();
      }
      return { foldedParents };
    });
  };

  blockRen = (contentBlock) => {
    window['block'] = contentBlock;

    if (this.allFoldedChildrenKeys.includes(contentBlock.key)) {
      return { component: InvisibleBlock };
    }
  };

  bindToWindow = () => {
    window['fold'] = this.foldAtCursor.bind(this);
    window['raw'] = this.rawContentState.blocks;
    window['model'] = this.state.documentModel;
    window['edstate'] = this.state.editorState;
    window['selection'] = this.selection;
  };
}

export default DJEditor;
