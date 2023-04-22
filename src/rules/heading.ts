import { MarkdownHeadingNode } from '../nodes';
import { Rule } from '../parser-v2';

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

    return true;
  },
  parse(state) {
    const start = state.position;

    state.progressUntil((char) => char === ' ');

    return {
      type: 'heading',
      level: (state.position - start) as 1 | 2 | 3 | 4 | 5 | 6,
      children: state.parseInline(() => state.charAt(0) === '\n'),
    };
  },
};
