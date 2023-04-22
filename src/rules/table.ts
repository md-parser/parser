import {
  MarkdownTableDataNode,
  MarkdownTableHeaderNode,
  MarkdownTableNode,
  MarkdownTableRowNode,
} from '../nodes';
import { Rule, State } from '../parser-v2';

const SPLIT_PIPE_REGEX = /(?:^|[^\\])\|/;
// Check if the next line is a table head and the next line after that is a table align line
const TABLE_MATCH_REGEX = /^\|.*?\|\n\s*\|[|\s-:]+\|\n/;

type Align = 'left' | 'center' | 'right';

/**
 * Parse a table alignment line
 * | --- | :---: | ---: |
 */
function parseAlignLine(line: string): Align[] {
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

function parseTableHead(state: State): MarkdownTableRowNode {
  const rows: MarkdownTableHeaderNode[] = [];

  // Skip to row content
  state.progressUntil(() => state.charAt(0) !== '|' && state.charAt(0) !== ' ');

  while (state.charAt(0) !== '\n' && state.charAt(0) !== ' ') {
    const rowNode: MarkdownTableHeaderNode = {
      type: 'tableHeader',
      align: 'left',
      children: state.parseInline(() => state.charAt(0) === '|' && state.charAt(-1) !== '\\'),
    };

    rows.push(rowNode);

    state.progressUntil(() => state.charAt(0) !== '|' && state.charAt(0) !== ' ');
  }

  // Skip to next row start
  state.progressUntil(() => state.charAt(0) === '|');

  // Parse alignment line
  // | --- | :---: | ---: |
  const src = state.src.slice(state.position);
  const lineEnd = src.indexOf('\n');
  const alignLine = src.slice(0, lineEnd);
  const alignment = parseAlignLine(alignLine);

  // Apply alignment to cells
  for (const [index, row] of rows.entries()) {
    row.align = alignment[index];
  }

  // Skip EOL
  state.progressUntil(() => state.charAt(0) === '\n');
  state.progress(1);

  return {
    type: 'tableRow',
    children: rows,
  };
}

function parseTableRows(state: State, align: Align[]): MarkdownTableRowNode[] {
  const rows: MarkdownTableRowNode[] = [];

  // Skip whitespaces
  state.progressUntil(() => state.charAt(0) === '|');

  while (state.charAt(0) === '|') {
    const row: MarkdownTableDataNode[] = [];

    state.progressUntil(() => state.charAt(0) !== '|' && state.charAt(0) !== ' ');

    while (state.charAt(0) !== '\n' && state.charAt(0) !== '') {
      row.push({
        type: 'tableData',
        align: 'left',
        children: state.parseInline(() => state.charAt(0) === '|' && state.charAt(-1) !== '\\'),
      });

      state.progressUntil(() => state.charAt(0) !== '|' && state.charAt(0) !== ' ');
    }

    // Skip EOL
    if (state.charAt(0) === '\n') {
      state.progress(1);
    }

    state.progressUntil(() => state.charAt(0) !== ' ');

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

export const tableRule: Rule<MarkdownTableNode> = {
  type: 'block',
  name: 'table',
  test(state) {
    if (state.charAt(0) !== '|') {
      return false;
    }

    return TABLE_MATCH_REGEX.test(state.src.slice(state.position));
  },
  parse(state) {
    const header = parseTableHead(state);
    const align = header.children.map((cell) => cell.align);

    return {
      type: 'table',
      header,
      rows: parseTableRows(state, align),
    };
  },
};
