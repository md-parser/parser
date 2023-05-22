import { MarkdownStrikeTroughNode } from '../../types/nodes';
import { Rule } from '../../types/rule';
import { hasValidClosingInBlock } from '../../utils/rule';

export const striketroughRule: Rule<MarkdownStrikeTroughNode> = {
  type: 'inline',
  name: 'striketrough',
  ruleStartChar: '~',
  test(state) {
    if (state.charAt(0) !== '~' && state.charAt(1) !== '~') {
      return false;
    }

    return hasValidClosingInBlock(state, '~~');
  },
  parse(state, parser) {
    // skip ~~
    parser.skip(2);

    const children = parser.parseInline(() => state.charAt(0) === '~' && state.charAt(1) === '~');

    // skip ~~
    parser.skip(2);

    return {
      type: 'strikeThrough',
      children,
    };
  },
};
