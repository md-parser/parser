import { MarkdownBlockQuoteNode } from '../nodes';
import { Rule } from '../parser-v2';

export const blockquoteRule: Rule<MarkdownBlockQuoteNode> = {
  type: 'inline-block',
  name: 'blockquote',
  test(state) {
    if (state.position < state.lineStart + state.indent) {
      return false;
    }

    if (state.indent > 3) {
      return false;
    }

    return state.charAt(0) === '>';
  },
  parse(state) {
    // Read until the next newline that isn't a blockquote
    const value = state.readUntil(() => {
      if (state.charAt(0) === '\n' && state.charAt(1) !== '>') {
        return true;
      }

      return false;
    });

    // Remove the > from the start of each line
    const cleanValue = value.replace(/^> ?/gm, '');

    return {
      type: 'blockquote',
      children: state.cloneParser().parse(cleanValue),
    };
  },
};
