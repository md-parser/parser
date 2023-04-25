import { parseMarkdown } from '../parseMarkdown';

describe('parse.blockquote', () => {
  it('should parse blockquote', () => {
    const ast = parseMarkdown('> Hello world');

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

  it('should parse blockquote', () => {
    const ast = parseMarkdown('> Hello > world\n>> Line 2\n> Line 3');

    expect(ast).toEqual([
      {
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value: 'Hello > world',
              },
            ],
          },
          {
            type: 'blockquote',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    value: 'Line 2',
                  },
                ],
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value: 'Line 3',
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should parse different indention levels as a single blockqoute', () => {
    const ast = parseMarkdown('> Hello world\n > Line 2');

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
              {
                type: 'lineBreak',
              },
              {
                type: 'text',
                value: 'Line 2',
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should parse two blockquotes seperated by a newline', () => {
    const ast = parseMarkdown('> Line 1\n\n> Line 2');

    expect(ast).toEqual([
      {
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value: 'Line 1',
              },
            ],
          },
        ],
      },
      {
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value: 'Line 2',
              },
            ],
          },
        ],
      },
    ]);
  });
});
