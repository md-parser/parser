export type MarkdownNodeBase = {
  type: string;
};

export type MarkdownTextNode = {
  type: 'text';
  value: string;
};

export type MarkdownParagraphNode = {
  type: 'paragraph';
  children: MarkdownNode[];
};

export type MarkdownStrongNode = {
  type: 'strong';
  children: MarkdownNode[];
};

export type MarkdownItalicNode = {
  type: 'italic';
  children: MarkdownNode[];
};

export type MarkdownStrikeTroughNode = {
  type: 'strike-through';
  children: MarkdownNode[];
};

export type MarkdownLinkNode = {
  type: 'link';
  href: string;
  children: MarkdownNode[];
};

export type MarkdownImageNode = {
  type: 'image';
  alt: string;
  src: string;
};

export type MarkdownHeadingNode = {
  type: 'heading';
  level: number;
  children: MarkdownNode[];
};

export type MarkdownLineBreakNode = {
  type: 'line-break';
};

export type MarkdownListNode = {
  type: 'list';
  ordered: boolean;
  // if ordered is true, then start is the starting number
  // start: number;
  children: (MarkdownListNode | MarkdownListItemNode)[];
};

export type MarkdownListItemNode = {
  type: 'list-item';
  children: MarkdownNode[];
};

export type MarkdownCodeNode = {
  type: 'code';
  value: string;
  language: string;
};

export type MarkdownInlineCodeNode = {
  type: 'inline-code';
  value: string;
};

export type MarkdownDividerNode = {
  type: 'divider';
};

export type MarkdownBlockQuoteNode = {
  type: 'blockquote';
  children: MarkdownNode[];
};

export type MarkdownTableNode = {
  type: 'table';
  header: MarkdownTableRowNode;
  rows: MarkdownTableRowNode[];
};

export type MarkdownTableRowNode = {
  type: 'table-row';
  children: MarkdownTableCellNode[];
};

export type MarkdownTableCellNode = {
  type: 'table-cell';
  align: 'left' | 'center' | 'right';
  children: MarkdownNode[];
};

export type MarkdownSubscriptNode = {
  type: 'subscript';
  children: MarkdownNode[];
};

export type MarkdownSuperscriptNode = {
  type: 'superscript';
  children: MarkdownNode[];
};

export type MarkdownNode =
  | MarkdownTextNode
  | MarkdownParagraphNode
  | MarkdownStrongNode
  | MarkdownLinkNode
  | MarkdownImageNode
  | MarkdownHeadingNode
  | MarkdownItalicNode
  | MarkdownStrikeTroughNode
  | MarkdownLineBreakNode
  | MarkdownListNode
  | MarkdownCodeNode
  | MarkdownInlineCodeNode
  | MarkdownDividerNode
  | MarkdownBlockQuoteNode
  | MarkdownTableNode
  | MarkdownSubscriptNode
  | MarkdownSuperscriptNode;
