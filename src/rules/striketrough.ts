import { MarkdownStrikeTroughNode } from '../types/nodes';
import { Rule } from '../types/rule';

export const striketroughRule: Rule<MarkdownStrikeTroughNode> = {
  type: 'inline',
  name: 'striketrough',
  ruleStartChar: '~',
  test(state) {
    if (state.charAt(0) !== '~') {
      return false;
    }

    if (state.charAt(1) !== '~') {
      return false;
    }


    return state.src.includes('~~', state.position + 3);
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
