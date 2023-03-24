import { parse } from '../parser';

describe('parse.blockquote', () => {
  it('should parse blockquote', () => {
    const ast = parse('> Hello world');

    expect(ast).toEqual([
      {
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
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
