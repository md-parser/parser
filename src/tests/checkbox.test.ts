import { parseMarkdown } from '../parseMarkdown';

describe('parse.checkbox', () => {
  it('should parse unchecked checkbox', () => {
    const ast = parseMarkdown('[ ] Unchecked');

    expect(ast).toEqual([
      {
        type: 'checkbox',
        checked: false,
        children: [
          {
            type: 'text',
            value: 'Unchecked',
          },
        ],
      },
    ]);
  });

  it('should parse checked checkbox', () => {
    const ast = parseMarkdown('[ ] Checked');

    expect(ast).toEqual([
      {
        type: 'checkbox',
        checked: true,
        children: [
          {
            type: 'text',
            value: 'Checked',
          },
        ],
      },
    ]);
  });
});
