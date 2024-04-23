import { TokenType, Tokens } from '../lexer2';
import { createRule } from '../rules';

export const textRule = createRule({
  name: 'text',
  type: 'inline',
  terminatedBy: ['inlineCode', 'emphasis'],
  parse(state) {
    const start = state.cursor;
    const token: Tokens = {
      type: TokenType.Text,
      tag: 'text',
      start,
      value: '',
    };

    state.tokens.push(token);

    while (state.cursor < state.length) {
      const char = state.src[state.cursor];

      if (state.testForTermination('text')) {
        return true;
      }

      token.value += char;
      state.cursor++;
    }

    return true;
  },
});
