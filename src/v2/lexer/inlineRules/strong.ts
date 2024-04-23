import { TokenType } from '../lexer2';
import { createRule } from '../rules';

const strongSymbols = new Set('*_');

export const strongRule = createRule({
  name: 'strong',
  type: 'inline',
  parse(state) {
    const char = state.src[state.cursor];
    const nextChar = state.src[state.cursor + 1];
    const start = state.cursor;
    let pos = state.cursor + 2;
    let value = '';

    if (!strongSymbols.has(char) || char !== nextChar) {
      return false;
    }

    const symbol = char;
    let count = 0;

    while (pos < state.length) {
      const char = state.src[pos];
      const nextChar = state.src[pos + 1];

      if (
        count % 2 === 0 &&
        char === symbol &&
        nextChar === symbol &&
        state.src[pos - 1] !== '\\'
      ) {
        console.log('count', count, count % 2);
        break;
      }

      if (char === symbol) {
        count++;
      }

      value += char;
      pos++;
    }

    if ((state.src[pos] !== symbol && state.src[pos + 1] !== symbol) || value === '') {
      return false;
    }

    state.cursor = pos + 2;

    state.tokens.push({
      type: TokenType.StrongStart,
      tag: 'em',
      start,
    });

    state.tokens.push({
      type: 'inline',
      content: value,
      start: start + 2,
      children: [],
    });

    state.tokens.push({
      type: TokenType.StrongEnd,
      tag: 'em',
      start: pos,
    });

    return true;
  },
});
