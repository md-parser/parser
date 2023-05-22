import { MarkdownCommentNode } from '../types/nodes';
import { Rule } from '../types/rule';

const COMMENT_REGEX = /<!--\s*(.*?)\s*-->/s;

export const commentRule: Rule<MarkdownCommentNode> = {
  type: 'inline-block',
  name: 'comment',
  ruleStartChar: '<',
  test(state) {
    if (state.charAt(0) !== '<') {
      return false;
    }

    return COMMENT_REGEX.test(state.src.slice(state.position));
  },
  parse(state, parser) {
    const src = state.src.slice(state.position);
    // We already validated that the comment is valid, so we can safely
    // use the first match.
    const match = src.match(COMMENT_REGEX) as RegExpMatchArray;

    parser.skip(match[0].length);

    return {
      type: 'comment',
      value: match[1],
    };
  },
};
