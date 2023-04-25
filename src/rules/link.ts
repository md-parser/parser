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
  parse(state) {
    // skip [
    state.progress(1);

    const children = state.parseInline(() => state.charAt(0) === ']');

    // skip ](
    state.progress(2);

    const href = state.readUntil((char) => char === '"' || char === ')').trimEnd();
    let title: string | undefined;

    if (state.charAt(0) === '"') {
      // skip "
      state.progress(1);

      title = state.readUntil((char) => char === '"' || char === ')');
    }

    state.progressUntil((char) => char === ')');

    // skip )
    state.progress(1);

    return {
      type: 'link',
      href,
      title,
      children,
    };
  },
};
