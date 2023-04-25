import { MarkdownEmphasisNode } from '../types/nodes';
import { Rule } from '../types/rule';

function isSpecialCharacter(char: string) {
  return char === '*' || char === '_'; // || char === '~';
}

export const emphasisRule: Rule<MarkdownEmphasisNode> = {
  type: 'inline',
  name: 'emphasis',
  ruleStartChar: ['*', '_'],
  test(state) {
    const char = state.charAt(0);

    if (!isSpecialCharacter(char) || isSpecialCharacter(state.charAt(1))) {
      return false;
    }

    // +2 because we expact the next not to be a special character
    return state.src.includes(char, state.position + 2);
  },
  parse(state) {
    const symbol = state.charAt(0);

    // skip symbol
    state.progress(1);

    const node: MarkdownEmphasisNode = {
      type: 'emphasis',
      children: state.parseInline(() => {
        return state.charAt(0) === symbol;
      }),
    };

    // skip symbol
    state.progress(1);

    return node;
  },
};
