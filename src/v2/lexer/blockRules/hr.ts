import { TokenType } from '../lexer2';
import { createRule } from '../rules';

export const hrRule = createRule({
  name: 'hr',
  type: 'block',
  parse(state) {
    const start = state.cursor;
    let value = '';
    let pos = start;

    // TODO
    // Skip whitespace
    while (state.src[pos] === ' ') {
      pos++;
    }

    while (pos < state.length) {
      const code = state.src.charCodeAt(pos);

      if (code === /* Newline */ 0x0a) {
        break;
      }

      if (code === 0x2a /* * */ || code === 0x5f /* _ */ || code === 0x2d /* - */) {
        value += state.src[pos];
        pos++;
        continue;
      }

      if (code === 0x20 /* space */ || code === 0x09 /* tab */) {
        pos++;
        continue;
      }

      return false;
    }

    const symbol = value[0];

    // Should have at least 3 of the same character
    if (value.length < 3 || value[1] !== symbol || value[2] !== symbol) {
      return false;
    }

    state.tokens.push({
      tag: 'hr',
      type: TokenType.HorizontalRule,
      start,
    });

    state.cursor = pos;
    return true;
  },
});
