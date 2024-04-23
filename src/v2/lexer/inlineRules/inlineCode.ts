import { TokenType } from '../lexer2';
import { createRule } from '../rules';

export const inlineCodeRule = createRule({
  name: 'inlineCode',
  type: 'inline',
  parse(state) {
    const start = state.cursor;
    const char = state.src[state.cursor];

    if (char !== '`') {
      return false;
    }

    let pos = state.cursor + 1;
    let value = '';

    while (pos < state.length) {
      const char = state.src[pos];

      if (char === '`') {
        break;
      }

      value += char;
      pos++;
    }

    if (state.src[pos] !== '`' || value === '') {
      return false;
    }

    state.cursor = pos + 1;

    state.tokens.push({
      type: TokenType.InlineCode,
      tag: 'code',
      start,
      value,
    });

    return true;
  },
});
