import { TokenType } from '../lexer2';
import { createRule } from '../rules';

export const codeRule = createRule({
  name: 'code',
  type: 'block',
  terminatedBy: ['heading', 'hr', 'blockquote'],
  parse(state) {
    const start = state.cursor;
    const char = state.src.slice(state.cursor, state.cursor + 3);
    let pos = state.cursor + 3;
    let value = '';

    if (char !== '```') {
      return false;
    }

    let endingFound = false;

    while (pos < state.length) {
      const char = state.src[pos];
      const nextChar = state.src[pos + 1];

      if (char === '`' && nextChar === '`' && state.src[pos + 2] === '`') {
        pos += 3;
        endingFound = true;
        break;
      }

      if (char === '\n' && nextChar === '\n') {
        break;
      }

      value += char;
      pos++;
    }

    if (!endingFound) {
      // Or throw an error?
      return false;
    }

    state.cursor = pos;

    state.tokens.push({
      type: TokenType.CodeStart,
      tag: 'code',
      start,
    });

    state.tokens.push({
      type: 'inline',
      content: value,
      children: [],
      start: start + 3,
    });

    state.tokens.push({
      type: TokenType.CodeEnd,
      tag: 'code',
      start: pos,
    });

    return true;
  },
});
