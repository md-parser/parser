import { MarkdownSuperscriptNode } from '../types/nodes';
import { Rule } from '../types/rule';

export const superscriptRule: Rule<MarkdownSuperscriptNode> = {
  type: 'inline',
  name: 'superscript',
  ruleStartChar: '^',
  test(state) {
    if (state.charAt(0) !== '^') {
      return false;
    }

    if (state.charAt(1) === '^') {
      return false;
    }

    return state.src.includes('^', state.position + 2);
  },
  parse(state) {
    // skip ^
    state.progress(1);

    const children = state.parseInline(() => state.charAt(0) === '^' && state.charAt(-1) !== '\\');

    // skip ^
    state.progress(1);

    return {
      type: 'superscript',
      children,
    };
  },
};
