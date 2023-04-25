import { MarkdownInlineCodeNode } from '../types/nodes';
import { Rule } from '../types/rule';
import { hasValidClosingInBlock } from '../utils/rule';

export const inlineCodeRule: Rule<MarkdownInlineCodeNode> = {
  type: 'inline',
  name: 'inlineCode',
  ruleStartChar: '`',
  test(state) {
    if (state.charAt(0) === '`') {
      return hasValidClosingInBlock(state, '`');
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
