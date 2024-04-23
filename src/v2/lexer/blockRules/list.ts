import { createRule } from '../rules';

export const listRule = createRule({
  name: 'list',
  type: 'block',
  terminatedBy: ['heading', 'hr', 'blockquote'],
  parse(state) {
    return false;
  },
});
