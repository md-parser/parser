# markdown-parser

## TODO

- [x] Lists indentation
- [ ] Lists parse multiline
- [x] Bold with \_\_
- [x] Striketrough ~~xx~~
- [ ] Tables
- [ ] Task list `- [ ] Task` `- [x] Finished Task`
- [ ] Blockquotes `> Blockquote`
- [x] Divider
- [ ] Character encoding `& > <` -> `&amp; &lt; &gt`;
- [ ] Escaped chacaters \!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~

https://www.markdownguide.org/basic-syntax/

```ts
parseBlock(); // Blocks are separated by two newlines
parseInline();
```
