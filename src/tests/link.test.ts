import { parseMarkdown } from '../parseMarkdown';

describe('parse.link', () => {
  it('should parse link', () => {
    const ast = parseMarkdown('[link text](https://example.com)');

    expect(ast).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            href: 'https://example.com',
            children: [
              {
                type: 'text',
                value: 'link text',
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should parse link with title', () => {
    const ast = parseMarkdown('[link text](https://example.com "title")');

    expect(ast).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            href: 'https://example.com',
            title: 'title',
            children: [
              {
                type: 'text',
                value: 'link text',
              },
            ],
          },
        ],
      },
    ]);
  });
});
