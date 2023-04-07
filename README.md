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
- [ ] Well formed HTML entities can be written inline directly. If you write &copy;, it will appear in the HTML output as ©.
- [ ] Parse multiline emphasis `*foo\nbar*` -> `<em>foo<br />bar</em>`
- [ ] Table cells, remove trailing spaces

https://www.markdownguide.org/extended-syntax
https://spec-md.com/
