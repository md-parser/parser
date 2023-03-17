import { parse } from './parser';

describe('parser', () => {
  it('should parse basic text', () => {
    const ast = parse(`
      # Title

      ## Subtitle
    `);

    expect(ast).toEqual([
      {
        type: 'heading',
        level: 1,
        children: [
          {
            type: 'text',
            value: 'Title',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        children: [
          {
            type: 'text',
            value: 'Subtitle',
          },
        ],
      },
    ]);
  });
});
