import { MarkdownSubscriptNode } from '../nodes';
import { Rule } from '../parser-v2';

export const subscriptRule: Rule<MarkdownSubscriptNode> = {
  type: 'inline',
  name: 'subscript',
  test(state) {
    if (state.charAt(0) !== '~') {
      return false;
    }

    // TODO Check if there is and ending ~

    return true;
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
