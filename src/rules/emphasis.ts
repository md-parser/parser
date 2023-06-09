import { MarkdownEmphasisNode } from '../types/nodes';
import { Rule } from '../types/rule';
import { hasValidClosingInBlock } from '../utils/rule';

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

    return hasValidClosingInBlock(state, char);
  },
  parse(state, parser) {
    const symbol = state.charAt(0);

    // skip symbol
    parser.skip(1);

    const node: MarkdownEmphasisNode = {
      type: 'emphasis',
      children: parser.parseInline(() => {
        return state.charAt(0) === symbol;
      }),
    };

    // skip symbol
    parser.skip(1);

    return node;
  },
};
