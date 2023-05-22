import { checkboxRule } from './rules/gfm/checkbox';
import { striketroughRule } from './rules/gfm/striketrough';
import { subscriptRule } from './rules/gfm/subscript';
import { superscriptRule } from './rules/gfm/superscript';
import {
  MarkdownCheckboxNode,
  MarkdownStrikeTroughNode,
  MarkdownSubscriptNode,
  MarkdownSuperscriptNode,
} from './types/nodes';
import { Rule } from './types/rule';

/**
 * Github Flavored Markdown
 */
export function GFM(): Rule<
  MarkdownSubscriptNode | MarkdownStrikeTroughNode | MarkdownSuperscriptNode | MarkdownCheckboxNode
>[] {
  return [striketroughRule, superscriptRule, subscriptRule, checkboxRule];
}
