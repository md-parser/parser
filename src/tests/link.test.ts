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
});
