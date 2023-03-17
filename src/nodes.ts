export type RootNode = {
  type: "root";
  children: Node[];
};

export type TextNode = {
  type: "text";
  value: string;
};

export type ParagraphNode = {
  type: "paragraph";
  children: Node[];
};

export type StrongNode = {
  type: "strong";
  children: Node[];
};

export type Node = RootNode | TextNode | ParagraphNode | StrongNode;
