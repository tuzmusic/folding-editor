//region Types/Enums

export type MarkdownStack = MarkdownNode[]
export type MarkdownNode = {
  tag: string
  text?: string
  children: MarkdownNode[]
  parent: MarkdownNode | null
}
export type HtmlTags = BodyTags | HeaderTags

export enum BodyTags {
  p = "p"
}

export enum HeaderTags {
  h1 = "h1",
  h2 = "h2",
  h3 = "h3",
  h4 = "h4",
  h5 = "h5",
  h6 = "h6",
}

export type TwainTextNode = [HtmlTags, string]
