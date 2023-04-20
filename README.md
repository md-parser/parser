# markdown-parser

## Install

```sh
yarn add @saartje87/md-ast
```

## Usage

```ts
import { parseMarkdown } from '@saartje87/md-ast';

const ast = parseMarkdown('# Hello World');
```

## Configuration

### GitHub Flavored Markdown

```ts
import { parseMarkdown, GFM } from '@saartje87/md-ast';

const ast = parseMarkdown('# Hello World', {
  presets: [GFM()],
});
```
