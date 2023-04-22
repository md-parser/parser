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

/**
 * @deprecated
 */
export type MarkdownItalicNode = {
  type: 'italic';
  children: MarkdownNode[];
};

export type MarkdownEmphasisNode = {
  type: 'emphasis';
  children: MarkdownNode[];
};

export type MarkdownStrikeTroughNode = {
  type: 'strikeThrough';
  children: MarkdownNode[];
};

export type MarkdownLinkNode = {
  type: 'link';
  href: string;
  title?: string;
  children: MarkdownNode[];
};

export type MarkdownImageNode = {
  type: 'image';
  alt: string;
  src: string;
  title?: string;
};

export type MarkdownHeadingNode = {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: MarkdownNode[];
};

export type MarkdownLineBreakNode = {
  type: 'lineBreak';
};

export type MarkdownListNode = {
  type: 'list';
  ordered: boolean;
  // if ordered is true, then start is the starting number
  start?: number;
  children: (MarkdownListNode | MarkdownListItemNode)[];
};

export type MarkdownListItemNode = {
  type: 'listItem';
  children: MarkdownNode[];
};

export type MarkdownCodeNode = {
  type: 'code';
  value: string;
  language?: string;
};

export type MarkdownInlineCodeNode = {
  type: 'inlineCode';
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
  type: 'tableRow';
  children: (MarkdownTableDataNode | MarkdownTableHeaderNode)[];
};

export type MarkdownTableHeaderNode = {
  type: 'tableHeader';
  align: 'left' | 'center' | 'right';
  children: MarkdownNode[];
};

export type MarkdownTableDataNode = {
  type: 'tableData';
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
  | MarkdownBlockQuoteNode
  | MarkdownCodeNode
  | MarkdownDividerNode
  | MarkdownHeadingNode
  | MarkdownImageNode
  | MarkdownInlineCodeNode
  | MarkdownItalicNode
  | MarkdownEmphasisNode
  | MarkdownLineBreakNode
  | MarkdownLinkNode
  | MarkdownListItemNode
  | MarkdownListNode
  | MarkdownParagraphNode
  | MarkdownStrikeTroughNode
  | MarkdownStrongNode
  | MarkdownSubscriptNode
  | MarkdownSuperscriptNode
  | MarkdownTableDataNode
  | MarkdownTableHeaderNode
  | MarkdownTableNode
  | MarkdownTableRowNode
  | MarkdownTextNode;
