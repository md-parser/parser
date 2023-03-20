import { parse } from './parser';

describe('parser', () => {
  it('should parse heading', () => {
    const ast = parse('# Title');

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
    ]);
  });

  it('should parse paragraph', () => {
    const ast = parse('Hello\nworld!');

    expect(ast).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: 'Hello',
          },
          {
            type: 'break',
          },
          {
            type: 'text',
            value: 'world!',
          },
        ],
      },
    ]);
  });
});
