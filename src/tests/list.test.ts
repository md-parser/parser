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
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    value: 'Item 1',
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    value: 'Item 2',
                  },
                ],
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
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    value: 'Item 1',
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    value: 'Item 2',
                  },
                ],
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
                type: 'paragraph',
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
                        type: 'paragraph',
                        children: [
                          {
                            type: 'text',
                            value: 'Item 2',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    value: 'Item 3',
                  },
                ],
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
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    value: 'text',
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should parse list seperated by tab after *', () => {
    const ast = parseMarkdown('*\tItem 1');

    expect(ast).toEqual([
      {
        type: 'list',
        ordered: false,
        children: [
          {
            type: 'listItem',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    value: 'Item 1',
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should parse list items correctly that contains a dash', () => {
    expect(parseMarkdown('- Red: 0% - 20%\n-	Amber: 21% - 35%')).toEqual([
      {
        type: 'list',
        ordered: false,
        children: [
          {
            type: 'listItem',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    value: 'Red: 0% - 20%',
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    value: 'Amber: 21% - 35%',
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);
  });

  // TODO - Fix this test
  it('should parse list items correctly that contains a horizontal rule', () => {
    expect(parseMarkdown('* foo\n\n---\n\n* bar')).toEqual([
      {
        type: 'list',
        ordered: false,
        children: [
          {
            type: 'listItem',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    value: 'foo',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'list',
        ordered: false,
        children: [
          {
            type: 'listItem',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    value: 'bar',
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);
  });
});
