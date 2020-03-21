import React, { useState } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

const ControlledEditor = () => {
    const [ editorState, setEditorState ] = useState(EditorState.createEmpty());
    const onEditorStateChange = (newState) => setEditorState(newState);

    return (
        <Editor
            editorState={ editorState }
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={ onEditorStateChange }
        />
    );

};

export default ControlledEditor;
