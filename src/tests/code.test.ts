import { parseMarkdown } from '../parseMarkdown';

describe('parse.code', () => {
  it('should parse code', () => {
    const ast = parseMarkdown('```\nHello world\n```');

    expect(ast).toEqual([
      {
        type: 'code',
        value: 'Hello world\n',
      },
    ]);
  });

  it('should parse code with language', () => {
    const ast = parseMarkdown('```tsx\nHello world\n```');

    expect(ast).toEqual([
      {
        type: 'code',
        language: 'tsx',
        value: 'Hello world\n',
      },
    ]);
  });
});
