import { MarkdownExpression } from '../expression';
import { MarkdownTableCellNode, MarkdownTableNode, MarkdownTableRowNode } from '../nodes';

type Align = 'left' | 'center' | 'right';

const SPLIT_PIPE = /(?<!\\)\|/;

export class TableExpression extends MarkdownExpression<MarkdownTableNode> {
  public type = 'block' as const;
  public name = 'table';

  matches(): boolean {
    if (this.peek() !== '|') {
      return false;
    }

    // Check if the next line is a table head
    // and the next line after that is a table align line
    return /^\|.*?\|\n\s*\|[|\s-:]+\|\n/.test(this.buffer());
  }

  toNode(): MarkdownTableNode {
    const header = this.parseTableHead();
    const align = header.children.map((cell) => cell.align);

    const node: MarkdownTableNode = {
      type: 'table',
      header,
      rows: this.parseRows(align),
    };

    return node;
  }

  parseAlignLine(line: string): Align[] {
    this.skipUntil(() => this.peek() === '|');

    // Repace | at start and end of line with empty string
    const cells = line.replace(/(^\|\s*)|(\s*\|$)/g, '').split(SPLIT_PIPE);

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
    const rows: MarkdownTableCellNode[] = [];

    // Skip whitespaces
    this.skipUntil(() => this.peek() === '|');

    // Skip |
    this.skip(1);
    this.skipUntil(() => this.peek() !== '|' && this.peek() !== ' ');

    while (this.peek() !== '\n' && this.peek() !== '') {
      const rowNode: MarkdownTableCellNode = {
        type: 'table-cell',
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
      type: 'table-row',
      children: rows,
    };
  }

  parseRows(align: Align[]): MarkdownTableRowNode[] {
    const rows: MarkdownTableRowNode[] = [];

    // Skip whitespaces
    this.skipUntil(() => this.peek() === '|');

    while (this.peek() === '|') {
      const row: MarkdownTableCellNode[] = [];

      // Skip |
      this.skip(1);
      this.skipUntil(() => this.peek() !== '|' && this.peek() !== ' ');

      while (this.peek() !== '\n' && this.peek() !== '') {
        const rowNode: MarkdownTableCellNode = {
          type: 'table-cell',
          align: 'left',
          children: this.parseInline(() => this.peek() === '|' && this.peekAt(-1) !== '\\'),
        };

        row.push(rowNode);

        this.skipUntil(() => this.peek() !== '|' && this.peek() !== ' ');
      }

      this.skipUntil(() => this.peek() === '|');

      // Apply alignment to cells
      for (const [index, cell] of row.entries()) {
        cell.align = align[index];
      }

      rows.push({
        type: 'table-row',
        children: row,
      });
    }

    return rows;
  }
}
