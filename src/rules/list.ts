import { MarkdownListNode } from '../types/nodes';
import { Rule } from '../types/rule';

const LIST_ITEM_REGEX = /^[\t ]*(?:[*+-]|\d+\.)[\t ]/;
const ORDERED_LIST_ITEM_REGEX = /^[\t ]*\d+.[\t ]/;
const EMPTY_LINE_REGEX = /^\s*$/;

function isList(value: string): boolean {
  return LIST_ITEM_REGEX.test(value);
}

function getBull(value: string): string {
  const match = value.match(LIST_ITEM_REGEX);

  return match ? match[0] : '';
}

function getLevel(value: string): number {
  const length = value.length;

  for (let level = 0; level < length; level++) {
    const char = value.charAt(level);

    if (char !== ' ' && char !== '\t') {
      return level;
    }
  }

  return 0;
}

const internalIndentRegexCache = new Map<number, RegExp>();

function getIndentRegex(indent: number): RegExp {
  if (internalIndentRegexCache.has(indent)) {
    return internalIndentRegexCache.get(indent) as RegExp;
  }

  const tabs = Math.ceil(indent / 4);
  const regex = new RegExp(`^(?: {${indent}}|\t{${tabs}})`);

  internalIndentRegexCache.set(indent, regex);

  return regex;
}
/**
 * Get lines from the current position
 *
 * @returns [markdownSlice: string, position: number]
 */
function getLines(text: string, indent: number): [string, number] {
  const lineRegex = /^(.*)(?:\n|\r\n?|$)/gm;
  const lines: string[] = [];
  const indentRegex = getIndentRegex(indent);

  let prevEmptyLine = false;
  let match;
  let position = 0;
  while ((match = lineRegex.exec(text))) {
    const line = match[0];

    if (line === '') {
      break;
    }

    const hasIndentation = indentRegex.test(line);

    // Break current list parsing when previous line is an empty line and current line does not match the indentation
    if (prevEmptyLine && line !== '' && !hasIndentation) {
      break;
    }

    // Break current list parsing when next line a list item on the same level as the current list
    if (!hasIndentation && isList(line)) {
      break;
    }

    prevEmptyLine = EMPTY_LINE_REGEX.test(line);

    position += line.length;

    lines.push(hasIndentation ? line.replace(indentRegex, '') : line);
  }

  return [lines.join(''), position];
}

export const listRule: Rule<MarkdownListNode> = {
  type: 'block',
  name: 'list',
  // ruleStartChar: ['*', '-', '+', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  test(state) {
    if (state.position > state.lineStart + state.indent) {
      return false;
    }

    const start = state.src.slice(state.position, state.position + 6);

    return LIST_ITEM_REGEX.test(start);
  },
  parse(state, parser) {
    function parseList(depth: number): MarkdownListNode {
      const lineStart = state.src.lastIndexOf('\n', state.position) + 1;
      const line = state.src.slice(lineStart);
      const ordered = ORDERED_LIST_ITEM_REGEX.test(line);
      const bullet = getBull(line);

      const node: MarkdownListNode = {
        type: 'list',
        ordered,
        children: [],
      };

      if (ordered) {
        node.start = Number.parseInt(bullet, 10);
      }

      while (state.position < state.length) {
        const lineStart = state.src.lastIndexOf('\n', state.position) + 1;
        const line = state.src.slice(lineStart);

        // Break current list parsing when next line is not a list item
        if (!isList(line)) {
          break;
        }

        const ordered = ORDERED_LIST_ITEM_REGEX.test(line);
        const bullet = getBull(line);

        const level = getLevel(bullet);

        // Break current list parsing when next list entry changes from ordered to unordered or vice versa
        if (level === depth && node.ordered !== ordered) {
          break;
        }

        if (level < depth) {
          break;
        }

        if (level > depth) {
          node.children.push(parseList(level));
          continue;
        }

        if (state.position >= state.length) {
          break;
        }

        if (state.charAt(0) === '\n' && (state.charAt(1) === '\n' || state.charAt(1) === '')) {
          // Only break of we find a matching rule?
          break;
        }

        parser.skip(bullet.length + (lineStart - state.position));

        const indent = state.position - state.lineStart;
        const [markdownSlice, position] = getLines(state.src.slice(state.position), indent);

        parser.skip(position);

        if (state.charAt(-1) === '\n') {
          parser.skip(-1);
        }

        parser.parseIndentation();

        node.children.push({
          type: 'listItem',
          children: parser.parse(markdownSlice),
        });
      }

      return node;
    }

    return parseList(state.indent);
  },
};
