import { MarkdownHeadingNode } from '../types/nodes';
import { Rule } from '../types/rule';

function getLevel(src: string) {
  const length = src.length;

  for (let level = 0; level < length; level++) {
    const char = src.charAt(level);

    if (char !== '#') {
      return level;
    }
  }

  return 0;
}

export const headingRule: Rule<MarkdownHeadingNode> = {
  type: 'block',
  name: 'heading',
  test(state) {
    if (state.indent > 3) {
      return false;
    }

    if (state.charAt(0) !== '#') {
      return false;
    }

    const level = getLevel(state.src.slice(state.position));

    return level > 0 && level < 7;
  },
  parse(state) {
    const start = state.position;

    state.progressUntil((char) => char === ' ');

    const level = (state.position - start) as 1 | 2 | 3 | 4 | 5 | 6;

    state.progress(1);

    return {
      type: 'heading',
      level,
      children: state.parseInline(() => state.charAt(0) === '\n'),
    };
  },
};
