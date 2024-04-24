import { TokenType } from '../lexer2';
import { createRule } from '../rules';

export const blockquoteRule = createRule({
  name: 'blockquote',
  type: 'block',
  terminatedBy: ['heading', 'hr'],
  parse(state) {
    const start = state.cursor;
    let pos = start;
    let value = '';

    if (state.src[pos] !== '>') {
      return false;
    }

    state.tokens.push({
      tag: 'blockquote',
      type: TokenType.BlockquoteStart,
      start,
    });

    while (pos < state.length) {
      const code = state.src.charCodeAt(pos);
      const nextCode = state.src.charCodeAt(pos + 1);

      // End of blockquote
      if (code === 0x0a /* Newline */ && nextCode === 0x0a /* Newline */) {
        pos += 2;
        break;
      }

      if (code === 0x0a /* Newline */ && nextCode !== 0x3e /* > */) {
        const prev = state.cursor;
        state.cursor = pos + 1;

        state.tokens.push(
          {
            type: 'inline',
            content: value,
            children: [],
            start,
          },
          {
            tag: 'blockquote',
            type: TokenType.BlockquoteEnd,
            start: pos,
          },
        );

        // is new block start?
        if (state.testForTermination('blockquote')) {
          return true;
        }

        state.cursor = prev;
        state.tokens.pop();
        state.tokens.pop();
      }

      value += state.src[pos];
      pos++;
    }

    state.tokens.push(
      {
        type: 'inline',
        content: value,
        children: [],
        start,
      },
      {
        tag: 'blockquote',
        type: TokenType.BlockquoteEnd,
        start: pos,
      },
    );

    state.cursor = pos;

    return true;
  },
});
