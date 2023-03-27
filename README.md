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

Or

```ts
import { parse } from '@saartje87/md-ast';

const parser = parse('# Hello World');
```

## TODO

- [x] Lists indentation
- [x] Lists parse multiline
- [x] Bold with \_\_
- [x] Striketrough ~~xx~~
- [x] Tables
- [ ] Task list `- [ ] Task` `- [x] Finished Task`
- [x] Blockquotes `> Blockquote`
- [x] Divider
- [ ] Character encoding `& > <` -> `&amp; &lt; &gt`;
- [ ] Escaped chacaters \!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~
- [ ] sub & superscript
