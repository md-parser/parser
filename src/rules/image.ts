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
  parse(state) {
    // skip ![
    state.progress(2);

    const alt = state.readUntil((char) => char === ']');

    // skip ](
    state.progress(2);

    const src = state.readUntil((char) => char === '"' || char === ')').trimEnd();
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
      type: 'image',
      alt,
      src,
      title,
    };
  },
};
