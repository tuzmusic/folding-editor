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

const StyleWrapper = styled.div({
  '& .DraftEditor-root': {
    padding: '0 20px',
  },
});
const InvisibleBlock = styled.div({ display: 'none' });
const FoldButton = styled.button(({
    position: 'absolute',
    bottom: 0,
    left: 0,
    margin: '20px',
  }),
  ({ disabled }) => ({ opacity: disabled ? 0.5 : 1 }), // default disabled opacity isn't transparent enough
);

type FoldingInfo = {
  parentKey: string,
  childKeys: string[]
}
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

  get currentFoldableNode(): FoldingInfo | null {
    // only fold when there is no selection
    // todo: it should actually be pretty easy to implement foldSelection()
    if (!this.selection.isCollapsed()) return null;

    const anchorKey = this.selection.getAnchorKey();
    const parentNode = this.state.documentModel.getNodeByKey(anchorKey);

    // only container nodes can be folded
    if (!(parentNode instanceof DJContainerNode)) return null;

    return {
      parentKey: anchorKey,
      childKeys: parentNode.getAllChildKeys(),
    };
  }

  render() {
    const { editorState } = this.state;
    const { updateState, blockRen, foldAtCursor } = this;
    this.bindToWindow(); // make lots of useful stuff accessible to the console

    return (
      <StyleWrapper>
        <FoldButton onClick={ foldAtCursor } disabled={ !this.currentFoldableNode }>
          Fold
        </FoldButton>
        <Editor
          editorState={ editorState }
          wrapperClassName="dj-wrapper"
          editorClassName="dj-editor"
          onEditorStateChange={ updateState }
          customBlockRenderFunc={ blockRen }
        />
      </StyleWrapper>
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

  forceRender = () => {
    const { editorState } = this.state;
    const currentSelection = this.selection;
    const content = editorState.getCurrentContent();
    const newEditorState = EditorState.createWithContent(content);
    const stateWithSelection = EditorState.forceSelection(newEditorState, currentSelection);
    this.setState({ editorState: stateWithSelection });
  };

  foldAtCursor = () => {
    const foldingInfo = this.currentFoldableNode;
    if (!foldingInfo) return;
    const { parentKey, childKeys } = foldingInfo;
    this.setState(({ foldedParents }) => { // we're mutating foldedParents so we need to operate in a setState callback
      if (this.foldedParentKeys.includes(parentKey)) { // UNFOLD
        delete foldedParents[parentKey];
      } else { // FOLD
        foldedParents[parentKey] = childKeys;
      }
      return { foldedParents };
    }, this.forceRender);
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
