import { MarkdownStrongNode } from '../types/nodes';
import { Rule } from '../types/rule';

function isSpecialCharacter(char: string) {
  return char === '*' || char === '_'; // || char === '~';
}

export const strongRule: Rule<MarkdownStrongNode> = {
  type: 'inline',
  name: 'strong',
  ruleStartChar: ['*', '_'],
  test(state) {
    const char = state.charAt(0);

    if (!isSpecialCharacter(char)) {
      return false;
    }

    if (state.charAt(1) !== char) {
      return false;
    }

    // +3 because we expact the next not to be a special character
    return state.src.includes(char + char, state.position + 3);
  },
  parse(state) {
    const symbol = state.charAt(0);

    // skip symbol
    state.progress(2);

    const node: MarkdownStrongNode = {
      type: 'strong',
      children: state.parseInline(() => {
        return state.charAt(0) === symbol && state.charAt(1) === symbol;
      }),
    };

    // skip symbol
    state.progress(2);

    return node;
  },
};
