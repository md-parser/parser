import { parse } from './parser';

describe('parser', () => {
  it('should parse a simple expression', () => {
    const ast = parse('Hello, **World**!');
    expect(ast).toEqual({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Hello, ',
            },
            {
              type: 'strong',
              children: [
                {
                  type: 'text',
                  value: 'World',
                },
              ],
            },
            {
              type: 'text',
              value: '!',
            },
          ],
        },
      ],
    });
  });
});
