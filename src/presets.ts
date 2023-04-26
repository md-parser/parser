import { striketroughRule } from './rules/striketrough';
import { subscriptRule } from './rules/subscript';
import { superscriptRule } from './rules/superscript';
import {
  MarkdownStrikeTroughNode,
  MarkdownSubscriptNode,
  MarkdownSuperscriptNode,
} from './types/nodes';
import { Rule } from './types/rule';

/**
 * Github Flavored Markdown
 */
export function GFM(): Rule<
  MarkdownSubscriptNode | MarkdownStrikeTroughNode | MarkdownSuperscriptNode
>[] {
  return [striketroughRule, superscriptRule, subscriptRule];
}
