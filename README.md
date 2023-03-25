# markdown-parser

## Install

```sh
yarn add @saartje87/md-ast
```

## Usage

```ts
import { MarkdownParser } from '@saartje87/md-ast';

const parser = new MarkdownParser('# Hello World');
const ast = parser.parse();
```

## TODO

- [ ] Lists indentation
- [ ] Lists parse multiline
- [x] Bold with \_\_
- [x] Striketrough ~~xx~~
- [ ] Tables
- [ ] Task list `- [ ] Task` `- [x] Finished Task`
- [x] Blockquotes `> Blockquote`
- [x] Divider
- [ ] Character encoding `& > <` -> `&amp; &lt; &gt`;
- [ ] Escaped chacaters \!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~
