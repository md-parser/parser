import { MarkdownLineBreakNode } from '../types/nodes';
import { Rule } from '../types/rule';

export const lineBreakRule: Rule<MarkdownLineBreakNode> = {
  type: 'inline',
  name: 'lineBreak',
  specialChars: '\n',
  test(state) {
    return state.charAt(0) === '\n';
  },
  parse(state) {
    // skip \n
    state.progress(1);

    return {
      type: 'lineBreak',
    };
  },
};
