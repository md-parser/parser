import { parseMarkdown } from '../parseMarkdown';
import { GFM } from '../presets';

describe('parse.checkbox', () => {
  it('should parse unchecked checkbox', () => {
    const ast = parseMarkdown('[ ] Unchecked', {
      presets: GFM(),
    });

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
    const ast = parseMarkdown('[x] Checked', {
      presets: GFM(),
    });

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
