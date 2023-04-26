# markdown-parser

## What is this?

This is a markdown parser that returns an AST (Abstract Syntax Tree) of the markdown document.

## What is different?

- Line breaks are always hard breaks
- No inline HTML
- Output is not sanitized

### Line breaks

Line breaks are always hard breaks. This means that a line break in the markdown document will always result in a `<br />` tag in the HTML output.
No additional spaces or slashes are required.

```md
Hello
World
```

```html
<p>Hello<br />World</p>
```

## Install

```sh
yarn add @md-parser/parse
```

## Usage

```ts
import { parseMarkdown } from '@md-parser/parse';

const ast = parseMarkdown('# Hello World');

// ast = [
//   {
//     "type": "heading",
//     "level": 1,
//     "children": [
//       {
//         "type": "text",
//         "value": "Hello World"
//       }
//     ]
//   }
// ]
```

## Configuration

### GitHub Flavored Markdown

```ts
import { parseMarkdown, GFM } from '@md-parser/parse';

const ast = parseMarkdown('# Hello World', {
  lineBreakType: 'default' | 'commonmark' | '....?', // How to handle line breaks (commonmark spec / ... / default: how a user expects it)
  presets: [GFM()],
});
```
