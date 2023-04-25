import { MarkdownSubscriptNode } from '../types/nodes';
import { Rule } from '../types/rule';
import { hasValidClosingInBlock } from '../utils/rule';

export const subscriptRule: Rule<MarkdownSubscriptNode> = {
  type: 'inline',
  name: 'subscript',
  ruleStartChar: '~',
  test(state) {
    if (state.charAt(0) !== '~') {
      return false;
    }

    if (state.charAt(1) === '~') {
      return false;
    }

    return hasValidClosingInBlock(state, '~');
  },
  parse(state) {
    // skip ~
    state.progress(1);

    const children = state.parseInline(() => state.charAt(0) === '~' && state.charAt(-1) !== '\\');

    // skip ~
    state.progress(1);

    return {
      type: 'subscript',
      children,
    };
  },
};
