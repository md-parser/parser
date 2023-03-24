import { parse } from '../parser';

describe('parse.divider', () => {
  it('should parse divider', () => {
    const ast = parse('---');

    expect(ast).toEqual([
      {
        type: 'divider',
      },
    ]);
  });
});
