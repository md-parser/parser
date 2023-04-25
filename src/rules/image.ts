import { MarkdownImageNode } from '../types/nodes';
import { Rule } from '../types/rule';

const IMAGE_REGEX = /^!\[.*?]\(.*\)/;

export const imageRule: Rule<MarkdownImageNode> = {
  type: 'inline',
  name: 'image',
  ruleStartChar: '!',
  test(state) {
    if (state.charAt(0) !== '!' && state.charAt(1) !== '[') {
      return false;
    }

    return IMAGE_REGEX.test(state.src.slice(state.position));
  },
  parse(state, parser) {
    // skip ![
    parser.skip(2);

    const alt = parser.readUntil((char) => char === ']');

    // skip ](
    parser.skip(2);

    const src = parser.readUntil((char) => char === '"' || char === ')').trimEnd();
    let title: string | undefined;

    // Parse image title
    if (state.charAt(0) === '"') {
      // skip "
      parser.skip(1);

      title = parser.readUntil((char) => char === '"' || char === ')');
    }

    parser.skipUntil((char) => char === ')');

    // skip )
    parser.skip(1);

    return {
      type: 'image',
      alt,
      src,
      title,
    };
  },
};
