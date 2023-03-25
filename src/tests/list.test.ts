import { parseMarkdown } from '../parseMarkdown';

describe.skip('parse.list', () => {
  it('should parse unordered list', () => {
    const ast = parseMarkdown('* Item 1\n* Item 2');

    expect(ast).toEqual([
      {
        type: 'list',
        ordered: false,
        children: [
          {
            type: 'list-item',
            children: [
              {
                type: 'text',
                value: 'Item 1',
              },
            ],
          },
          {
            type: 'list-item',
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
        children: [
          {
            type: 'list-item',
            children: [
              {
                type: 'text',
                value: 'Item 1',
              },
            ],
          },
          {
            type: 'list-item',
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
            type: 'list-item',
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
                type: 'list-item',
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
            type: 'list-item',
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
});
