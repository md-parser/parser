import { parseMarkdown } from '../parseMarkdown';

describe('parse.emphasis', () => {
  it('should parse italic with *', () => {
    const ast = parseMarkdown('*Hello world*');

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

  it('should parse italic with _', () => {
    const ast = parseMarkdown('_Hello world_');

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

  it('should parse bold with with **', () => {
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

  it('should parse bold with __', () => {
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

  it('should parse strikethrough with ~~', () => {
    const ast = parseMarkdown('~~Hello world~~');

    expect(ast).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'strike-through',
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

  it('should parse bold with link', () => {
    const ast = parseMarkdown('__[Link text](https://example.com "Link title"), more text__');

    expect(ast).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'strong',
            children: [
              {
                type: 'link',
                href: 'https://example.com',
                title: 'Link title',
                children: [
                  {
                    type: 'text',
                    value: 'Link text',
                  },
                ],
              },
              {
                type: 'text',
                value: ', more text',
              },
            ],
          },
        ],
      },
    ]);
  });
});
