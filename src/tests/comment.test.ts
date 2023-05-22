import { parseMarkdown } from '../parseMarkdown';

describe('parse.comment', () => {
  it('should parse comment', () => {
    const ast = parseMarkdown('<!-- comment -->');

    expect(ast).toEqual([
      {
        type: 'comment',
        value: 'comment',
      },
    ]);
  });

  it('should parse multi line comment', () => {
    const ast = parseMarkdown('<!-- line1\nline2\nline3 -->');

    expect(ast).toEqual([
      {
        type: 'comment',
        value: 'line1\nline2\nline3',
      },
    ]);
  });
});
