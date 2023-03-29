import { parseMarkdown } from '../parseMarkdown';

describe('parse.image', () => {
  it('should parse image', () => {
    const ast = parseMarkdown('![alt text](https://example.com/img.png)');

    expect(ast).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'image',
            alt: 'alt text',
            src: 'https://example.com/img.png',
          },
        ],
      },
    ]);
  });

  it('should parse image with title', () => {
    const ast = parseMarkdown('![alt text](https://example.com/img.png "title text")');

    expect(ast).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'image',
            alt: 'alt text',
            src: 'https://example.com/img.png',
            title: 'title text',
          },
        ],
      },
    ]);
  });
});
