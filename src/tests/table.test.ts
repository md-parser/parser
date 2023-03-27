const markdownTable = `| Heading 1  | Heading 2 |
| ------------- |-------------:|
| left foo      | right foo     |
| left bar      | right bar     |
| left baz      | right baz     |`;

import { parseMarkdown } from '../parseMarkdown';

describe('parse.divider', () => {
  it('should parse divider', () => {
    const ast = parseMarkdown(markdownTable);

    expect(ast).toEqual([
      {
        type: 'table',
        header: {
          type: 'table-row',
          children: [
            {
              type: 'table-cell',
              align: 'left',
              children: [
                {
                  type: 'text',
                  value: 'Heading 1  ',
                },
              ],
            },
            {
              type: 'table-cell',
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
            type: 'table-row',
            children: [
              {
                type: 'table-cell',
                align: 'left',
                children: [
                  {
                    type: 'text',
                    value: 'left foo      ',
                  },
                ],
              },
              {
                type: 'table-cell',
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
            type: 'table-row',
            children: [
              {
                type: 'table-cell',
                align: 'left',
                children: [
                  {
                    type: 'text',
                    value: 'left bar      ',
                  },
                ],
              },
              {
                type: 'table-cell',
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
            type: 'table-row',
            children: [
              {
                type: 'table-cell',
                align: 'left',
                children: [
                  {
                    type: 'text',
                    value: 'left baz      ',
                  },
                ],
              },
              {
                type: 'table-cell',
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
