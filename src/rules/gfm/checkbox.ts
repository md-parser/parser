import { CheckboxNode } from '../../types/nodes';
import { Rule } from '../../types/rule';

export const checkboxRule: Rule<CheckboxNode> = {
  type: 'block', // inline-block?
  name: 'checkbox',
  // ruleStartChar: '[',
  test(state) {
    if (state.charAt(0) !== '[') {
      return false;
    }

    if (state.charAt(1) !== ' ' && state.charAt(1) !== 'x') {
      return false;
    }

    if (state.charAt(2) !== ']') {
      return false;
    }

    return true;
  },
  parse(state, parser) {
    const checked = state.charAt(1).toLowerCase() === 'x';

    parser.skip(3); // [ ] or [x]
    parser.skipUntil((char) => char !== ' '); // skip whitespace

    return {
      type: 'checkbox',
      checked: checked,
      children: parser.parseInline(() => {
        return state.charAt(0) === '\n';
      }),
    };
  },
};
