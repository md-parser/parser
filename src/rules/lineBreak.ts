import { MarkdownLineBreakNode } from '../types/nodes';
import { Rule } from '../types/rule';

export const lineBreakRule: Rule<MarkdownLineBreakNode> = {
  type: 'inline',
  name: 'lineBreak',
  ruleStartChar: '\n',
  test(state) {
    return state.charAt(0) === '\n';
  },
  parse(state, parser) {
    // skip \n
    parser.skip(1);

    return {
      type: 'lineBreak',
    };
  },
};
