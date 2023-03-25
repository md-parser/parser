import { MarkdownNode } from './nodes';
import { MarkdownParser } from './parser';
import { Expression } from './types';

export const parseMarkdown = (markdown: string, expressions?: Expression[]): MarkdownNode[] => {
  const parser = new MarkdownParser(markdown, expressions);
  return parser.parse();
};
