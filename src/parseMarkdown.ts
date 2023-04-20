import { MarkdownNode } from './nodes';
import { MarkdownParser, ParserConfig } from './parser';

export const parseMarkdown = (markdown: string, config: ParserConfig = {}): MarkdownNode[] => {
  const expressions = config.presets?.flat() || [];

  const parser = new MarkdownParser(markdown, expressions);
  return parser.parse();
};
