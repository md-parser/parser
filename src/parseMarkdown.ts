import { MarkdownNode } from './nodes';
import { MarkdownParser } from './parser';

export const parseMarkdown = (markdown: string): MarkdownNode[] => {
  const parser = new MarkdownParser(markdown);
  return parser.parse();
};
