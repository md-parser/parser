# markdown-parser

## What is this?

Markdown parser that returns an AST (Abstract Syntax Tree) of the markdown document.

## What is different?

- Line breaks are always hard breaks
- No inline HTML
- Output is not sanitized
- Headings can only be defined by `#` characters

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

### Headings

Headings can only be defined by `#` characters. This means that headings cannot be defined by underlines or `=` characters.

Valid:

```md
# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6
```

Invalid:

```md
# Heading 1
```

## Inline HTML

Inline HTML is parsed as is. This means that the HTML is not parsed as markdown. To prevent security vulnerabilities, the markdown renderer should sanitize the output.

### Sanitization

In a markdown parser, "sanitized output" refers to removing or encoding potentially harmful HTML or code to prevent security vulnerabilities. This is not the job of a markdown parser. This is the job of a markdown renderer. This parser only returns an AST. It is up to the renderer to sanitize the output.

## Install

```sh
yarn add @md-parser/parse
```

## How to use

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
  presets: [GFM()],
});
```
