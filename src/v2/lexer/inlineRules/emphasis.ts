import { TokenType } from '../lexer2';
import { createRule } from '../rules';

const emphasisSymbols = new Set('*_');

export const emphasisRule = createRule({
  name: 'emphasis',
  type: 'inline',
  parse(state) {
    const char = state.src[state.cursor];
    const nextChar = state.src[state.cursor + 1];
    const start = state.cursor;
    let pos = state.cursor;
    let value = '';

    if (!emphasisSymbols.has(char)) {
      return false;
    }

    const symbol = char;

    pos += 1;

    while (pos < state.length) {
      const char = state.src[pos];

      if (char === symbol && state.src[pos - 1] !== '\\') {
        break;
      }

      value += char;
      pos++;
    }

    if (state.src[pos] !== symbol || value === '') {
      return false;
    }

    state.cursor = pos + 1;

    state.tokens.push({
      type: TokenType.EmphasisStart,
      tag: 'em',
      start,
    });

    state.tokens.push({
      type: TokenType.Text,
      tag: 'text',
      start: start + 1,
      value,
    });

    state.tokens.push({
      type: TokenType.EmphasisEnd,
      tag: 'em',
      start: pos,
    });

    return true;
  },
});
