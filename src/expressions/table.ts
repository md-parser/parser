import { MarkdownExpression } from '../expression';
import {
  MarkdownTableDataNode,
  MarkdownTableHeaderNode,
  MarkdownTableNode,
  MarkdownTableRowNode,
} from '../nodes';

type Align = 'left' | 'center' | 'right';

const SPLIT_PIPE_REGEX = /(?:^|[^\\])\|/;
// Check if the next line is a table head and the next line after that is a table align line
const TABLE_MATCH_REGEX = /^\|.*?\|\n\s*\|[|\s-:]+\|\n/;

export class TableExpression extends MarkdownExpression<MarkdownTableNode> {
  public type = 'block' as const;
  public name = 'table' as const;

  matches(): boolean {
    if (this.peek() !== '|') {
      return false;
    }

    return TABLE_MATCH_REGEX.test(this.buffer());
  }

  toNode(): MarkdownTableNode {
    const header = this.parseTableHead();
    const align = header.children.map((cell) => cell.align);

    return {
      type: 'table',
      header,
      rows: this.parseRows(align),
    };
  }

  parseAlignLine(line: string): Align[] {
    this.skipUntil(() => this.peek() === '|');

    // Replace | at start and end of line with empty string
    const cells = line.replace(/(^\|\s*)|(\s*\|$)/g, '').split(SPLIT_PIPE_REGEX);

    return cells.map((cell) => {
      const trimmed = cell.trim();

      if (trimmed.startsWith(':') && trimmed.endsWith(':')) {
        return 'center';
      }

      if (trimmed.startsWith(':')) {
        return 'left';
      }

      if (trimmed.endsWith(':')) {
        return 'right';
      }

      return 'left';
    });
  }

  parseTableHead(): MarkdownTableRowNode {
    const rows: MarkdownTableHeaderNode[] = [];

    // Skip whitespaces
    this.skipUntil(() => this.peek() === '|');

    // Skip |
    this.skip(1);
    this.skipUntil(() => this.peek() !== '|' && this.peek() !== ' ');

    while (this.peek() !== '\n' && this.peek() !== '') {
      const rowNode: MarkdownTableHeaderNode = {
        type: 'tableHeader',
        align: 'left',
        children: this.parseInline(() => this.peek() === '|' && this.peekAt(-1) !== '\\'),
      };

      rows.push(rowNode);

      this.skipUntil(() => this.peek() !== '|' && this.peek() !== ' ');
    }

    // Skip to next row start
    this.skipUntil(() => this.peek() === '|');

    // Parse alignment line
    const lineEnd = this.buffer().indexOf('\n');
    const alignLine = this.buffer().slice(0, lineEnd);
    const alignment = this.parseAlignLine(alignLine);

    // Apply alignment to cells
    for (const [index, row] of rows.entries()) {
      row.align = alignment[index];
    }

    // Skip EOL
    this.skip(lineEnd + 1);

    return {
      type: 'tableRow',
      children: rows,
    };
  }

  parseRows(align: Align[]): MarkdownTableRowNode[] {
    const rows: MarkdownTableRowNode[] = [];

    // Skip whitespaces
    this.skipUntil(() => this.peek() === '|');

    while (this.peek() === '|') {
      const row: MarkdownTableDataNode[] = [];

      // Skip |
      this.skip(1);
      this.skipUntil(() => this.peek() !== '|' && this.peek() !== ' ');

      while (this.peek() !== '\n' && this.peek() !== '') {
        const rowNode: MarkdownTableDataNode = {
          type: 'tableData',
          align: 'left',
          children: this.parseInline(() => this.peek() === '|' && this.peekAt(-1) !== '\\'),
        };

        row.push(rowNode);

        this.skipUntil(() => this.peek() !== '|' && this.peek() !== ' ');
      }

      // Skip EOL
      if (this.peek() === '\n') {
        this.skip(1);
      }

      this.skipUntil(() => this.peek() !== ' ');

      // Apply alignment to cells
      for (const [index, cell] of row.entries()) {
        cell.align = align[index];
      }

      rows.push({
        type: 'tableRow',
        children: row,
      });
    }

    return rows;
  }
}
