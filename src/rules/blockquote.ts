import { MarkdownBlockQuoteNode } from '../types/nodes';
import { Rule } from '../types/rule';

export const blockquoteRule: Rule<MarkdownBlockQuoteNode> = {
  type: 'inline-block',
  name: 'blockquote',
  ruleStartChar: '>',
  test(state) {
    if (state.charAt(0) !== '>') {
      return false;
    }

    // Blockquote must be at the start of the line
    // we need this check because we are using the inline-block type
    if (state.position > state.lineStart + state.indent) {
      return false;
    }

    return true;
  },
  parse(state, parser) {
    // Read until the next newline that isn't a blockquote
    const value = parser.readUntil(() => {
      if (state.charAt(0) === '\n' && state.charAt(1) !== '>') {
        // Check if the next line is indented
        for (let i = 1; i < 4; i++) {
          // And is not a newline
          if (state.charAt(i) === '\n') {
            return true;
          }

          if (state.charAt(i + 1) === '>') {
            return false;
          }
        }
        return true;
      }

      return false;
    });

    // Remove the > from the start of each line
    const cleanValue = value.replace(/^\s*> ?/gm, '');

    return {
      type: 'blockquote',
      children: parser.parse(cleanValue),
    };
  },
};
