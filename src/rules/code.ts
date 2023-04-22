import { MarkdownCodeNode } from '../nodes';
import { Rule } from '../parser-v2';

const CODE_BACKTICKS = '```';

export const codeRule: Rule<MarkdownCodeNode> = {
  type: 'block',
  name: 'code',
  test(state) {
    // 4 spaces === code block
    if (state.indent >= 4) {
      return true;
    }

    if (state.charAt(0) === '`' && state.charAt(1) === '`' && state.charAt(2) === '`') {
      // TODO Validate ending
      return true;
    }

    return false;
  },
  parse(state) {
    if (state.indent >= 4) {
      const match = state.src.slice(state.position - state.indent).match(/^( {4}[^\n]+(?:\n|$))+/g);

      if (!match) {
        return {
          type: 'code',
          value: state.readUntil(() => state.charAt(0) === '\n'),
        };
      }

      const raw = match[0];
      const value = raw.replace(/^(\s{4})/gm, '');

      state.progress(raw.length - state.indent);

      return {
        type: 'code',
        value,
      };
    }

    // skip ```
    state.progress(3);

    const language = state.readUntil(() => state.charAt(0) === '\n') || undefined;

    // skip newline
    state.progress(1);

    const value = state.readUntil(() => state.slice(0, 3) === CODE_BACKTICKS);

    // skip ```
    state.progress(3);

    return {
      type: 'code',
      language,
      value,
    };
  },
};
