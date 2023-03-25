import { MarkdownExpression } from './expression';
import { MarkdownNode } from './nodes';
import { MarkdownParser } from './parser';

export type Expression = new (parser: MarkdownParser) => MarkdownExpression<MarkdownNode>;
