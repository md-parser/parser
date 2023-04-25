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

  it('should parse code indented by a tab', () => {
    const ast = parseMarkdown('\tfoo\tbaz\t\tbim\n');

    expect(ast).toEqual([
      {
        type: 'code',
        value: 'foo\tbaz\t\tbim\n',
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

  it('should parse code blocks that start with 4 spaces', () => {
    const ast = parseMarkdown('    Hello world\n');

    expect(ast).toEqual([
      {
        type: 'code',
        value: 'Hello world\n',
      },
    ]);
  });

  it('should parse multiline code blocks that start with 4 spaces', () => {
    const ast = parseMarkdown('    Hello world\n    Hello world\n');

    expect(ast).toEqual([
      {
        type: 'code',
        value: 'Hello world\nHello world\n',
      },
    ]);
  });
});
