import { SubscriptExpression } from './expressions/subscript';
import { SuperscriptExpression } from './expressions/superscript';
import { Expression } from './types';

/**
 * Github Flavored Markdown
 */
export function GFM(): Expression[] {
  return [SuperscriptExpression, SubscriptExpression];
}
