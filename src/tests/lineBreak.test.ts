import { parseMarkdown } from '../parseMarkdown';

describe('parse.lineBreak', () => {
  it('should parse line break', () => {
    const ast = parseMarkdown('Line 1\nLine 2');

    expect(ast).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: 'Line 1',
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
    ]);
  });

  it('should parse single backslash on the end of a line as a line break', () => {
    const ast = parseMarkdown('Line 1\\\nLine 2');

    expect(ast).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: 'Line 1',
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
    ]);
  });
});
