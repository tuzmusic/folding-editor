import React from "react";
import styled from "@emotion/styled";

const Editor = styled.textarea({
  height: '300px'
});

type Props = {
  text: string,
  setText: (text: string) => void;
}

const SimpleTextEditView = ({ text, setText }: Props) => {
  const didChangeText = (e: any) => {
    setText(e.target.value)
  };
  return (
    <>
      <Editor value={ text } onChange={ didChangeText }/>
    </>
  );
};

export default SimpleTextEditView;
