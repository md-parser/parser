import { MarkdownCommentNode } from '../types/nodes';
import { Rule } from '../types/rule';

const COMMENT_REGEX = /<!--(.*?)-->/s;

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
    const match = src.match(COMMENT_REGEX);

    if (!match) {
      throw new Error('Comment regex failed');
    }

    parser.skip(match[0].length);

    return {
      type: 'comment',
      value: match[1],
    };
  },
};
