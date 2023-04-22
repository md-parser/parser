import { MarkdownStrikeTroughNode } from '../nodes';
import { Rule } from '../parser-v2';

export const striketroughRule: Rule<MarkdownStrikeTroughNode> = {
  type: 'inline',
  name: 'striketrough',
  test(state) {
    if (state.charAt(0) !== '~') {
      return false;
    }

    // TODO Check if there is and ending ^

    return state.charAt(1) === '~';
  },
  parse(state) {
    // skip ~~
    state.progress(2);

    const children = state.parseInline(() => state.charAt(0) === '~' && state.charAt(1) === '~');

    // skip ~~
    state.progress(2);

    return {
      type: 'strikeThrough',
      children,
    };
  },
};
