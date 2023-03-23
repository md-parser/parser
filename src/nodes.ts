export type RootNode = {
  type: 'root';
  children: Node[];
};

export type TextNode = {
  type: 'text';
  value: string;
};

export type ParagraphNode = {
  type: 'paragraph';
  children: Node[];
};

export type StrongNode = {
  type: 'strong';
  children: Node[];
};

export type ItalicNode = {
  type: 'italic';
  children: Node[];
};

export type LinkNode = {
  type: 'link';
  href: string;
  children: Node[];
};

export type ImageNode = {
  type: 'image';
  alt: string;
  src: string;
};

export type HeadingNode = {
  type: 'heading';
  level: number;
  children: Node[];
};

export type LineBreakNode = {
  type: 'linebreak';
};

export type ListNode = {
  type: 'list';
  ordered: boolean;
  // if ordered is true, then start is the starting number
  // start: number;
  children: (ListNode | ListItemNode)[];
};

export type ListItemNode = {
  type: 'list-item';
  children: Node[];
};

export type CodeBlockNode = {
  type: 'code-block';
  value: string;
  language: string;
};

export type InlineCodeNode = {
  type: 'inline-code';
  value: string;
};

export type Node =
  | TextNode
  | ParagraphNode
  | StrongNode
  | LinkNode
  | ImageNode
  | HeadingNode
  | ItalicNode
  | LineBreakNode
  | ListNode
  | CodeBlockNode
  | InlineCodeNode;
