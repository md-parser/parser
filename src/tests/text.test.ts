import { parseMarkdown } from '../parseMarkdown';

describe('parse.text', () => {
  it('should parse text', () => {
    const ast = parseMarkdown('Hello world');

    expect(ast).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: 'Hello world',
          },
        ],
      },
    ]);
  });

  it('should parse escaped characters', () => {
    const ast = parseMarkdown(
      '\\!\\"\\#\\$\\%\\&\\\'\\(\\)\\*\\+\\,\\-\\.\\/\\:\\;\\<\\=\\>\\?\\@\\[\\\\\\]\\^\\_\\`\\{\\|\\}\\~',
    );

    expect(ast).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~',
          },
        ],
      },
    ]);
  });
});
