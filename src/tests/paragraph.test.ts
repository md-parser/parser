import { parse } from '../parser';

describe('parse.paragraph', () => {
  it('should parse paragraph', () => {
    const ast = parse('Hello world');

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

  it('should parse multiple lines paragraph', () => {
    const ast = parse('Hello\nworld');

    expect(ast).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: 'Hello',
          },
          {
            type: 'linebreak',
          },
          {
            type: 'text',
            value: 'world',
          },
        ],
      },
    ]);
  });

  it('should parse multiple paragraphs', () => {
    const ast = parse('Part 1\n\nPart 2');

    expect(ast).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: 'Part 1',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: 'Part 2',
          },
        ],
      },
    ]);
  });
});
