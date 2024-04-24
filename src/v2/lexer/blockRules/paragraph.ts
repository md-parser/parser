import { TokenType } from '../lexer2';
import { createRule } from '../rules';

export const paragraphRule = createRule({
  name: 'paragraph',
  type: 'block',
  terminatedBy: ['hr', 'heading', 'blockquote'],
  parse(state) {
    const start = state.cursor;
    let pos = start;
    let value = '';

    state.mode = 'inline';
    state.tokens.push({
      tag: 'p',
      type: TokenType.ParagraphStart,
      start,
    });

    // Use lines to iterate over the source

    while (pos < state.length) {
      const code = state.src.charCodeAt(pos);
      const nextCode = state.src.charCodeAt(pos + 1);

      if (code === /* Newline */ 0x0a && (nextCode === 0x0a || isNaN(nextCode))) {
        pos += 2;
        break;
      }

      if (code === /* Newline */ 0x0a) {
        const prev = state.cursor;
        state.cursor = pos + 1;
        state.mode = 'block';

        state.tokens.push(
          {
            type: 'inline',
            content: value,
            children: [],
            start,
          },
          {
            tag: 'p',
            type: TokenType.ParagraphEnd,
            start: pos,
          },
        );

        // is new block start?
        if (state.testForTermination('paragraph')) {
          return true;
        }

        state.cursor = prev;
        state.mode = 'inline';
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
        tag: 'p',
        type: TokenType.ParagraphEnd,
        start: pos,
      },
    );

    state.cursor = pos;
    state.mode = 'block';

    return true;
  },
});
