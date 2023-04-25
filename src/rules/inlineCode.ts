import { MarkdownInlineCodeNode } from '../types/nodes';
import { Rule } from '../types/rule';

export const inlineCodeRule: Rule<MarkdownInlineCodeNode> = {
  type: 'block',
  name: 'inlineCode',
  test(state) {
    // 4 spaces === code block
    if (state.indent >= 4) {
      return true;
    }

    if (state.charAt(0) === '`') {
      // TODO Validate ending
      return true;
    }

    return false;
  },
  parse(state) {
    // skip `
    state.progress(1);

    const value = state.readUntil((char) => char === '`');

    // skip `
    state.progress(1);

    return {
      type: 'inlineCode',
      value,
    };
  },
};
