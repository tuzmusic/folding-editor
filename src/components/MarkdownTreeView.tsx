import { MarkdownNode } from "../models/MarkdownNode";
import MarkdownNodeView from "./MarkdownNodeView";
import React from "react";
import styled from "@emotion/styled";
import { FullWidthFlexDiv } from "./StyledComponents";

const TextDisplayContainer = styled(FullWidthFlexDiv)({
  flex: 1,
  border: 'solid black thin',
  flexDirection: 'column',
  padding: '10px'
});

type Props = {
  tree: MarkdownNode[]
}
const MarkdownTreeView = ({ tree }: Props) =>
  <TextDisplayContainer>
    {
      tree.map((root: MarkdownNode, i) =>
        <MarkdownNodeView node={ root } indentLevel={ 0 } key={ i }/>)
    }
  </TextDisplayContainer>;

export default MarkdownTreeView
