import { MarkdownNode } from './nodes';
import { ParserConfig } from './parser';
import { mdAST } from './parser-v2';

export function parseMarkdown(src: string, config?: ParserConfig): MarkdownNode[] {
  return mdAST().parse(src);
}
