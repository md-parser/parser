import { MarkdownLineBreakNode } from '../types/nodes';
import { Rule } from '../types/rule';

export const lineBreakRule: Rule<MarkdownLineBreakNode> = {
  type: 'inline',
  name: 'lineBreak',
  ruleStartChar: ['\n', '\\'],
  test(state) {
    const char = state.charAt(0);

    if (char === '\\' && state.charAt(1) === '\n') {
      return true;
    }

    return state.charAt(0) === '\n';
  },
  parse(state, parser) {
    if (state.charAt(0) === '\\') {
      // skip \
      parser.skip(1);
    }

    // skip \n
    parser.skip(1);

    return {
      type: 'lineBreak',
    };
  },
};
