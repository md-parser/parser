import { MarkdownDividerNode } from '../types/nodes';
import { Rule } from '../types/rule';

export const dividerRule: Rule<MarkdownDividerNode> = {
  type: 'block',
  name: 'divider',
  test(state) {
    if (state.indent > 3) {
      return false;
    }

    const symbol = state.charAt(0);

    if (symbol !== '*' && symbol !== '_' && symbol !== '-') {
      return false;
    }

    let symbolCount = 0;

    for (let i = 0; i + state.position < state.length; i++) {
      const char = state.charAt(i);

      if (char === symbol) {
        symbolCount += 1;
        continue;
      }

      if (char === ' ' && symbolCount >= 3) {
        continue;
      }

      if (char === '\n') {
        break;
      }

      return false;
    }

    return symbolCount >= 3;
  },
  parse(state) {
    state.progressUntil((char) => char === '\n');

    return {
      type: 'divider',
    };
  },
};
