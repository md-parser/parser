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

export type BreakNode = {
  type: 'break';
};

export type Node =
  | TextNode
  | ParagraphNode
  | StrongNode
  | LinkNode
  | ImageNode
  | HeadingNode
  | ItalicNode
  | BreakNode;
