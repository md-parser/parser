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

### With options

```ts
import { parseMarkdown } from '@saartje87/md-ast';

const ast = parseMarkdown('# Hello World', {
  expressions: [],
});
```

## TODO

- [ ] Task list `- [ ] Task` `- [x] Finished Task`
- [ ] Character encoding `& > <` -> `&amp; &lt; &gt`;
- [ ] Escaped chacaters \!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~
