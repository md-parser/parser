import { parseMarkdown } from '../parseMarkdown';

describe('parse.heading', () => {
  it('should parse heading', () => {
    const ast = parseMarkdown('# Title');

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

  it('should parse heading level', () => {
    const ast = parseMarkdown('###### Title');

    expect(ast).toEqual([
      {
        type: 'heading',
        level: 6,
        children: [
          {
            type: 'text',
            value: 'Title',
          },
        ],
      },
    ]);
  });

  it('should treat a heading >6 as regular text', () => {
    const ast = parseMarkdown('######## Title');

    expect(ast).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: '######## Title',
          },
        ],
      },
    ]);
  });
});
