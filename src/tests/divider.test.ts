import { parseMarkdown } from '../parseMarkdown';

describe('parse.divider', () => {
  it('should parse divider', () => {
    const ast = parseMarkdown('---');

    expect(ast).toEqual([
      {
        type: 'divider',
      },
    ]);
  });
});
