# markdown-parser

## TODO

- [x] Lists indentation
- [ ] Lists parse multiline
- [ ] Bold with underline
- [ ] Striketrough ~~xx~~
- [ ] Tables
- [ ] Task list `- [ ] Task` `- [x] Finished Task`
- [ ] Blockquotes `> Blockquote`
- [ ] Divider
- [ ] Character encoding `& > <` -> `&amp; &lt; &gt`;
- [ ] Escaped chacaters \!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~

https://www.markdownguide.org/basic-syntax/

```ts
parseBlock(); // Blocks are separated by two newlines
parseInline();
```
