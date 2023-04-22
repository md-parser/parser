import { MarkdownLineBreakNode } from '../nodes';
import { Rule } from '../parser-v2';

export const lineBreakRule: Rule<MarkdownLineBreakNode> = {
  type: 'inline',
  name: 'lineBreak',
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
