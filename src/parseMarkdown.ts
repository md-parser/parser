import { ParserConfig, mdAST } from './parser';
import { MarkdownNode } from './types/nodes';

export function parseMarkdown(src: string, config?: ParserConfig): MarkdownNode[] {
  return mdAST(config).parse(src);
}
