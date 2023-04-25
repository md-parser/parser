import { MarkdownLinkNode } from '../types/nodes';
import { Rule } from '../types/rule';

const LINK_REGEX = /^\[.*]\(.*\)/;

export const linkRule: Rule<MarkdownLinkNode> = {
  type: 'inline',
  name: 'link',
  ruleStartChar: '[',
  test(state) {
    if (state.charAt(0) !== '[') {
      return false;
    }

    return LINK_REGEX.test(state.src.slice(state.position));
  },
  parse(state, parser) {
    // skip [
    parser.skip(1);

    const children = parser.parseInline(() => state.charAt(0) === ']');

    // skip ](
    parser.skip(2);

    const href = parser.readUntil((char) => char === '"' || char === ')').trimEnd();
    let title: string | undefined;

    if (state.charAt(0) === '"') {
      // skip "
      parser.skip(1);

      title = parser.readUntil((char) => char === '"' || char === ')');
    }

    parser.skipUntil((char) => char === ')');

    // skip )
    parser.skip(1);

    return {
      type: 'link',
      href,
      title,
      children,
    };
  },
};
