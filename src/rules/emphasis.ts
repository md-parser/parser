import { MarkdownEmphasisNode } from '../nodes';
import { Rule } from '../parser-v2';

function isSpecialCharacter(char: string) {
  return char === '*' || char === '_'; // || char === '~';
}

export const emphasisRule: Rule<MarkdownEmphasisNode> = {
  type: 'inline',
  name: 'emphasis',
  test(state) {
    const char = state.charAt(0);

    if (!isSpecialCharacter(char)) {
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
