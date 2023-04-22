import { MarkdownListNode } from '../nodes';
import { Rule } from '../parser-v2';

// const LIST_ITEM_REGEX = /^(?:[*+-]|\d+\.)\s/;
const LIST_ITEM_REGEX = /^\s*(?:[*+-]|\d+\.) /;
const ORDERED_LIST_ITEM_REGEX = /^[\t |]*\d+. /;

function isList(value: string): boolean {
  return LIST_ITEM_REGEX.test(value);
}

function getBull(value: string): string {
  const match = value.match(LIST_ITEM_REGEX);

  return match ? match[0] : '';
}

export const listRule: Rule<MarkdownListNode> = {
  type: 'inline-block',
  name: 'list',
  test(state) {
    // const char = state.charAt(0);
    if (state.position > state.lineStart + state.indent) {
      return false;
    }

    const start = state.src.slice(state.position, state.position + 6);

    return LIST_ITEM_REGEX.test(start);

    // if (char !== '*' && char !== '-' && char !== '+') {
    //   return false;
    // }

    // if (state.position > state.lineStart + state.indent) {
    //   return false;
    // }

    // return state.charAt(1) === ' ';
  },
  parse(state) {
    function parseList(depth: number): MarkdownListNode {
      const lineStart = state.src.lastIndexOf('\n', state.position) + 1;
      const line = state.src.slice(lineStart);
      const ordered = ORDERED_LIST_ITEM_REGEX.test(line);
      const bullet = getBull(line);
      // const levelIndex = bullet.lastIndexOf(' ', bullet.length - 2);
      // const level = levelIndex === -1 ? 0 : levelIndex + 1;

      const node: MarkdownListNode = {
        type: 'list',
        ordered,
        children: [],
      };

      if (ordered) {
        node.start = Number.parseInt(bullet, 10);
      }

      while (state.position < state.length) {
        // state.progressUntil(() => state.charAt(0) !== '\n');

        const lineStart = state.src.lastIndexOf('\n', state.position) + 1;
        const line = state.src.slice(lineStart);
        const ordered = ORDERED_LIST_ITEM_REGEX.test(line);
        const bullet = getBull(line);
        const levelIndex = bullet.lastIndexOf(' ', bullet.length - 2);
        const level = levelIndex === -1 ? 0 : levelIndex + 1;

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

// function parseList(depth = 0): MarkdownListNode {
//   // state.moveToStartOfLine();

//   const buffer = state.src.slice(state.position);
//   const ordered = ORDERED_LIST_ITEM_REGEX.test(buffer);
//   const bullet = getBull(buffer);

//   const listNode: MarkdownListNode = {
//     type: 'list',
//     ordered,
//     children: [],
//   };

//   if (ordered) {
//     listNode.start = Number.parseInt(bullet, 10);
//   }

//   let line = state.src.slice(state.src.lastIndexOf('\n', state.position) + 1);
//   let level = 0;

//   console.log(state.position, state.length);
//   console.log('LINE', JSON.stringify(line));

//   while (
//     level < bullet.length &&
//     (bullet.charAt(level) === ' ' || bullet.charAt(level) === '\t')
//   ) {
//     level++;
//   }

//   // if (depth !== level) {
//   //   console.log('PUCH', depth, level, JSON.stringify(bullet));

//   //   console.error('Invalid list depth', { ...state });
//   //   throw new Error('Invalid list depth');
//   //   return listNode;
//   // }

//   while (LIST_ITEM_REGEX.test(line)) {
//     if (state.position >= state.length) {
//       break;
//     }

//     const ordered = ORDERED_LIST_ITEM_REGEX.test(line);
//     const bullet = getBull(line);

//     let level = 0;

//     while (
//       level < bullet.length &&
//       (bullet.charAt(level) === ' ' || bullet.charAt(level) === '\t')
//     ) {
//       level++;
//     }

//     // console.log('LINE', JSON.stringify(line));
//     // console.log('LELVEL', level, depth, JSON.stringify(bullet));

//     // Break current list parsing when next list entry changes from ordered to unordered or vice versa
//     if (level === depth && listNode.ordered !== ordered) {
//       break;
//     }

//     // Parse list item
//     if (level === depth) {
//       state.progress(bullet.length);

//       listNode.children.push({
//         type: 'listItem',
//         children: state.parseInline(() => {
//           return (
//             (state.charAt(0) === '\n' && state.charAt(1) === '\n') ||
//             (state.charAt(0) === '\n' && isList(state.slice(1)))
//           );
//         }),
//       });

//       // if (state.charAt(0) === '\n') {
//       //   state.progress(1);
//       // }
//     }

//     if (level > depth) {
//       console.log('FROMHERE', state.position, line);
//       listNode.children.push(parseList(level));
//       continue;
//     }

//     if (level < depth) {
//       break;
//     }

//     if (state.position >= state.length) {
//       break;
//     }

//     // Two line breaks, end of list
//     if (state.charAt(0) === '\n' && state.charAt(1) === '\n') {
//       break;
//     }

//     line = state.src.slice(state.src.lastIndexOf('\n', state.position) + 1);

//     // console.log('HIER', line, state.position);

//     // break;
//   }

//   // console.log('LIST PARSING', listNode);
//   // state.progress(state.length);

//   return listNode;
// }
