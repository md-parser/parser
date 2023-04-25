import { MarkdownListNode } from '../types/nodes';
import { Rule } from '../types/rule';

const LIST_ITEM_REGEX = /^\s*(?:[*+-]|\d+\.)[\t ]/;
const ORDERED_LIST_ITEM_REGEX = /^[\t ]*\d+. /;

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

export const listRule: Rule<MarkdownListNode> = {
  type: 'inline-block',
  name: 'list',
  ruleStartChar: ['*', '-', '+', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  test(state) {
    if (state.position > state.lineStart + state.indent) {
      return false;
    }

    const start = state.src.slice(state.position, state.position + 6);

    return LIST_ITEM_REGEX.test(start);
  },
  parse(state) {
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
          break;
        }

        state.progress(bullet.length + (lineStart - state.position));

        node.children.push({
          type: 'listItem',
          children: state.parseInline(() => {
            return (
              (state.charAt(0) === '\n' && state.charAt(1) === '\n') ||
              (state.charAt(0) === '\n' && isList(state.slice(1)))
            );
          }),
        });
      }

      return node;
    }

    return parseList(state.indent);
  },
};
