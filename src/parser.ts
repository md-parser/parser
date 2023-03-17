export function parse(markdown: string) {}

const ast = parse('Hello, **World**!');
// ast = {
//   type: 'root',
//   children: [
//     {
//       type: 'paragraph',
//       children: [
//         {
//           type: 'text',
//           value: 'Hello, '
//         },
//         {
//           type: 'strong',
//           children: [
//             {
//               type: 'text',
//               value: 'World'
//             }
//           ]
//         },
//         {
//           type: 'text',
//           value: '!'
//         }
//       ]
//     }
//   ]
// }
