import { parseMarkdown } from '../parseMarkdown';

describe('parse.list', () => {
  it('should parse unordered list', () => {
    const ast = parseMarkdown('* Item 1\n* Item 2');

    expect(ast).toEqual([
      {
        type: 'list',
        ordered: false,
        children: [
          {
            type: 'listItem',
            children: [
              {
                type: 'text',
                value: 'Item 1',
              },
            ],
          },
          {
            type: 'listItem',
            children: [
              {
                type: 'text',
                value: 'Item 2',
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should parse ordered list', () => {
    const ast = parseMarkdown('1. Item 1\n2. Item 2');

    expect(ast).toEqual([
      {
        type: 'list',
        ordered: true,
        start: 1,
        children: [
          {
            type: 'listItem',
            children: [
              {
                type: 'text',
                value: 'Item 1',
              },
            ],
          },
          {
            type: 'listItem',
            children: [
              {
                type: 'text',
                value: 'Item 2',
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should parse multilevel unordered list', () => {
    // Note the tab character before the second list item
    const ast = parseMarkdown('* Item 1\n\t* Item 2\n* Item 3');

    expect(ast).toEqual([
      {
        type: 'list',
        ordered: false,
        children: [
          {
            type: 'listItem',
            children: [
              {
                type: 'text',
                value: 'Item 1',
              },
            ],
          },
          {
            type: 'list',
            ordered: false,
            children: [
              {
                type: 'listItem',
                children: [
                  {
                    type: 'text',
                    value: 'Item 2',
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            children: [
              {
                type: 'text',
                value: 'Item 3',
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should parse start of ordered list', () => {
    expect(parseMarkdown('10. text')).toEqual([
      {
        type: 'list',
        ordered: true,
        start: 10,
        children: [
          {
            type: 'listItem',
            children: [
              {
                type: 'text',
                value: 'text',
              },
            ],
          },
        ],
      },
    ]);
  });
});
