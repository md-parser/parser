import { parseMarkdown } from '../parseMarkdown';

describe('parse.divider', () => {
  it('should parse divider', () => {
    const ast = parseMarkdown(`| Heading 1  | Heading 2 |
| ------------- |-------------:|
| left foo      | right foo     |
| left bar      | right bar     |
| left baz      | right baz     |`);

    expect(ast).toEqual([
      {
        type: 'table',
        header: {
          type: 'tableRow',
          children: [
            {
              type: 'tableHeader',
              align: 'left',
              children: [
                {
                  type: 'text',
                  value: 'Heading 1  ',
                },
              ],
            },
            {
              type: 'tableHeader',
              align: 'right',
              children: [
                {
                  type: 'text',
                  value: 'Heading 2 ',
                },
              ],
            },
          ],
        },
        rows: [
          {
            type: 'tableRow',
            children: [
              {
                type: 'tableData',
                align: 'left',
                children: [
                  {
                    type: 'text',
                    value: 'left foo      ',
                  },
                ],
              },
              {
                type: 'tableData',
                align: 'right',
                children: [
                  {
                    type: 'text',
                    value: 'right foo     ',
                  },
                ],
              },
            ],
          },
          {
            type: 'tableRow',
            children: [
              {
                type: 'tableData',
                align: 'left',
                children: [
                  {
                    type: 'text',
                    value: 'left bar      ',
                  },
                ],
              },
              {
                type: 'tableData',
                align: 'right',
                children: [
                  {
                    type: 'text',
                    value: 'right bar     ',
                  },
                ],
              },
            ],
          },
          {
            type: 'tableRow',
            children: [
              {
                type: 'tableData',
                align: 'left',
                children: [
                  {
                    type: 'text',
                    value: 'left baz      ',
                  },
                ],
              },
              {
                type: 'tableData',
                align: 'right',
                children: [
                  {
                    type: 'text',
                    value: 'right baz     ',
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
