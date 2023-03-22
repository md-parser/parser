import { parse } from '../parser';

describe('parse.emphasis', () => {
  it('should parse italic', () => {
    const ast = parse('*Hello world*');

    expect(ast).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'italic',
            children: [
              {
                type: 'text',
                value: 'Hello world',
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should parse bold', () => {
    const ast = parse('**Hello world**');

    expect(ast).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'strong',
            children: [
              {
                type: 'text',
                value: 'Hello world',
              },
            ],
          },
        ],
      },
    ]);
  });
});
