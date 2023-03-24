import { parse } from '../parser';

describe('parse.emphasis', () => {
  it('should parse italic with *', () => {
    const ast = parse('*Hello world*');

    expect(ast).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'italic',
            children: [
              {
                type: 'text',
                value: 'Hello world',
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should parse italic with _', () => {
    const ast = parse('_Hello world_');

    expect(ast).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'italic',
            children: [
              {
                type: 'text',
                value: 'Hello world',
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should parse bold with with **', () => {
    const ast = parse('**Hello world**');

    expect(ast).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'strong',
            children: [
              {
                type: 'text',
                value: 'Hello world',
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should parse bold with __', () => {
    const ast = parse('__Hello world__');

    expect(ast).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'strong',
            children: [
              {
                type: 'text',
                value: 'Hello world',
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should parse strikethrough with ~~', () => {
    const ast = parse('~~Hello world~~');

    expect(ast).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'strike-through',
            children: [
              {
                type: 'text',
                value: 'Hello world',
              },
            ],
          },
        ],
      },
    ]);
  });
});
