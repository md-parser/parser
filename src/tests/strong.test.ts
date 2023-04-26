import { parseMarkdown } from '../parseMarkdown';

describe('parse.strong', () => {
  it('should parse strong with with **', () => {
    const ast = parseMarkdown('**Hello world**');

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

  it('should parse strong with __', () => {
    const ast = parseMarkdown('__Hello world__');

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

  it('should span multiple lines', () => {
    const ast = parseMarkdown('__Hello\nworld__');

    expect(ast).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'strong',
            children: [
              {
                type: 'text',
                value: 'Hello',
              },
              {
                type: 'lineBreak',
              },
              {
                type: 'text',
                value: 'world',
              },
            ],
          },
        ],
      },
    ]);
  });
});
