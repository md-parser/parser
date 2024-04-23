import { TokenType } from '../lexer2';
import { createRule } from '../rules';

export const headingRule = createRule({
  name: 'heading',
  type: 'block',
  parse(state) {
    const start = state.cursor;
    let pos = start;
    let value = '';
    let level = 0;
    let spaceCount = 0;

    while (pos < state.length) {
      const code = state.src.charCodeAt(pos);

      if (code === 0x23 /* # */) {
        level++;
        pos++;
        continue;
      }

      if (code === 0x20 /* space */) {
        pos++;
        spaceCount++;
        continue;
      }

      // End of heading
      if (code === 0x0a /* Newline */) {
        break;
      }

      value += state.src[pos];
      pos++;
    }

    if (level === 0) {
      return false;
    }

    state.tokens.push({
      tag: `h${level}`,
      type: TokenType.HeadingStart,
      start,
    });

    state.tokens.push({
      type: 'inline',
      content: value,
      children: [],
      start: start + level + 1,
    });

    state.tokens.push({
      tag: `h${level}`,
      type: TokenType.HeadingEnd,
      start: pos,
    });

    state.cursor = pos;
    return true;
  },
});
