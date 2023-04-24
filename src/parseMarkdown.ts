import { MarkdownNode } from './nodes';
import { ParserConfig, mdAST } from './parser-v2';

export function parseMarkdown(src: string, config?: ParserConfig): MarkdownNode[] {
  return mdAST().parse(src);
}
