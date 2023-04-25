import { MarkdownCodeNode } from '../types/nodes';
import { Rule } from '../types/rule';

const BACKTICK = '`';
const CODE_BACKTICKS = '```';

export const codeRule: Rule<MarkdownCodeNode> = {
  type: 'block',
  name: 'code',
  test(state) {
    // 4 spaces === code block
    if (state.indent >= 4) {
      return true;
    }

    if (
      state.charAt(0) === BACKTICK &&
      state.charAt(1) === BACKTICK &&
      state.charAt(2) === BACKTICK
    ) {
      // TODO Validate ending
      return true;
    }

    return false;
  },
  parse(state, parser) {
    // Tabs are set to 4 spaces in markdown so we need to calculate the real indentation
    const realIndent = state.position - state.lineStart;

    if (state.indent >= 4) {
      const match = state.src
        .slice(state.position - realIndent)
        .match(/^((?: {4}|\t)[^\n]*(?:\n|$))+/g);

      if (!match) {
        return {
          type: 'code',
          value: parser.readUntil(() => state.charAt(-1) === '\n'),
        };
      }

      const raw = match[0];
      const value = raw.replace(/^( {4}|\t)/gm, '');

      parser.skip(raw.length - realIndent);

      return {
        type: 'code',
        value,
      };
    }

    // skip ```
    parser.skip(3);

    const language = parser.readUntil((char) => char === '\n') || undefined;

    // skip newline
    parser.skip(1);

    const value = parser.readUntil(
      (char) => char === BACKTICK && state.slice(0, 3) === CODE_BACKTICKS,
    );

    // skip ```
    parser.skip(3);

    return {
      type: 'code',
      language,
      value,
    };
  },
};
