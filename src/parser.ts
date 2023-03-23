import {
  CodeBlockNode,
  HeadingNode,
  ImageNode,
  InlineCodeNode,
  ItalicNode,
  LineBreakNode,
  LinkNode,
  ListNode,
  Node,
  StrongNode,
  TextNode,
} from './nodes';

const ESCAPE = '\\';
const EOL = '\n';

export function parse(markdown: string): Node[] {
  const ast: Node[] = [];

  let index = 0;
  const length = markdown.length;

  //
  function debug(str?: string) {
    console.log('debug', str, JSON.stringify(markdown.slice(index)));
  }

  function peek(index: number) {
    return markdown[index];
  }

  function peekPart(index: number, length: number) {
    return markdown.slice(index, index + length);
  }

  function peekAll(index: number) {
    return markdown.slice(index);
  }

  function lookAhead(value: string, from: number): boolean {
    return markdown.includes(value, from);
  }

  function next() {
    return markdown[index++];
  }

  function setIndex(value: number) {
    index = value;
  }

  function skipEmptySpaces() {
    while (index < length && peek(index) === ' ') {
      next();
    }
  }

  function skipEmpty() {
    while (index < length && (peek(index) === ' ' || peek(index) === EOL)) {
      index++;
    }
  }

  function parseText(stopAtChar?: string): TextNode {
    let value = '';
    const stopAtCharLength = stopAtChar ? stopAtChar.length : 0;

    while (index < length && !isSpecialChar(index)) {
      if (stopAtChar && peekPart(index, stopAtCharLength) === stopAtChar) {
        break;
      }

      // Remove escape character
      if (peek(index) === ESCAPE && isSpecialChar(index + 1, true)) {
        next();
        continue;
      }

      value += next();
    }

    return {
      type: 'text',
      value,
    };
  }

  // Rename to parseInline?
  function parseSection(stopAtChar?: string): Node[] {
    const nodes = [];
    const stopAtCharLength = stopAtChar ? stopAtChar.length : 0;

    while (index < length) {
      if (stopAtChar && peekPart(index, stopAtCharLength) === stopAtChar) {
        setIndex(index + stopAtCharLength);
        break;
      }

      if (peek(index) === EOL && (peek(index + 1) === EOL || index + 1 >= length)) {
        break;
      }

      if (isSpecialChar(index)) {
        const node = parseSpecial();

        if (!node) {
          nodes.push(parseText());
          break;
        }

        nodes.push(node);
        continue;
      }

      nodes.push(parseText(stopAtChar));
    }

    return nodes;
  }

  // Rename to isStartOfNode()?
  function isSpecialChar(index: number, skipEscape = false): boolean {
    const char = peek(index);
    const next = peek(index + 1);

    if (!skipEscape && peek(index - 1) === ESCAPE) {
      return false;
    }

    if (isEmphasis(index) || isUnorderedList(index) || isInlineCode(index)) {
      return true;
    }

    return char === EOL || (char === '!' && next === '[') || char === '[';
  }

  function isUnorderedList(index: number): boolean {
    const buffer = peekAll(index);

    return /^[\t |]*[*+-] /.test(buffer);
  }

  function isList(index: number): boolean {
    return /^[\t |]*([*+-]|\d+.) /.test(peekAll(index));
  }

  function parseList(depth = 0): ListNode {
    const node: ListNode = {
      type: 'list',
      ordered: /^[\t |]*\d+. /.test(peekAll(index)),
      children: [],
    };

    while (index < length && isList(index)) {
      let level = 0;

      while (peek(index + level) === ' ' || peek(index + level) === '\t') {
        level++;
      }

      const match = peekAll(index).match(/^[\t |]*([*+-]|\d+.) /); //  /^[ |\t]*\d+. /.match(peekAll(index));

      if (!match) {
        break;
      }

      // Break current list parsing when next list entry changes from ordered to unordered or vice versa
      if (level === depth && node.ordered !== /\d+./.test(match[1])) {
        break;
      }

      if (level === depth) {
        setIndex(index + match[0].length);

        node.children.push({
          type: 'list-item',
          // TODO Should spawn over multiple lines, then check for EOL+EOL or EOL+NEWLINE?
          children: parseSection(EOL),
        });
      }

      if (level > depth) {
        node.children.push(parseList(level));
        continue;
      }

      if (level < depth) {
        break;
      }

      // Two line breaks, end of list
      if (peek(index - 1) === EOL && peek(index) === EOL) {
        break;
      }
    }

    return node;
  }

  function isEmphasis(index: number): boolean {
    const char = peek(index);

    if (char !== '*') {
      return false;
    }

    const endString = peek(index + 1) === '*' ? '**' : '*';

    return lookAhead(endString, index + 1);
  }

  function parseEmphasis(): StrongNode | ItalicNode {
    const char = peek(index);
    const nextChar = peek(index + 1);

    if (char === '*' && nextChar === '*') {
      next();
      next();

      const children = parseSection('**');

      return {
        type: 'strong',
        children,
      };
    }

    next();

    return {
      type: 'italic',
      children: parseSection('*'),
    };
  }

  function parseRawValue(stopAtChar: string): string {
    const start = index;
    const end = markdown.indexOf(stopAtChar, index);

    setIndex(end + stopAtChar.length);

    return markdown.slice(start, end);
  }

  function isInlineCode(index: number): boolean {
    // Make sure it's not an empty code block
    if (peek(index) !== '`' || peek(index + 1) === '`') {
      return false;
    }

    return lookAhead('`', index + 1);
  }

  function parseInlineCode(): InlineCodeNode {
    // Skip `
    next();

    return {
      type: 'inline-code',
      value: parseRawValue('`'),
    };
  }

  function isCodeBlock(index: number): boolean {
    return peekPart(index, 3) === '```' && lookAhead('```', index + 3);
  }

  function parseCodeBlock(): CodeBlockNode {
    const language = markdown.slice(index + 3, markdown.indexOf(EOL, index + 3));

    setIndex(markdown.indexOf(EOL, index + 3) + 1);

    return {
      type: 'code-block',
      language,
      value: parseRawValue('\n```'),
    };
  }

  function parseSpecial(): Node | void {
    const char = peek(index);

    if (isEmphasis(index)) {
      return parseEmphasis();
    }

    if (isInlineCode(index)) {
      return parseInlineCode();
    }

    if (isInlineCode(index)) {
      return parseCodeBlock();
    }

    if (char === EOL && peek(index + 1) !== EOL) {
      return parseBreak();
    }

    if (char === '!' && peek(index + 1) === '[') {
      return parseImage();
    }

    if (char === '[') {
      return parseLink();
    }

    console.log('No match!?', JSON.stringify(char), JSON.stringify(markdown.slice(index)));
  }

  function parseBreak(): LineBreakNode | void {
    // skip ' ' and '\n'
    skipEmpty();

    if (index >= length) {
      return;
    }

    return {
      type: 'linebreak',
    };
  }

  function parseImage(): ImageNode {
    let alt = '';
    let src = '';

    // skip !
    next();

    // skip [
    next();

    while (index < length && peek(index) !== ']') {
      alt += next();
    }

    // skip ]
    next();

    // skip (
    next();

    while (index < length && peek(index) !== ')') {
      src += next();
    }

    // skip )
    next();

    return {
      type: 'image',
      alt,
      src,
    };
  }

  function parseLink(): LinkNode {
    let href = '';

    // skip [
    next();

    const children = parseSection(']');

    // skip (
    next();

    while (index < length && peek(index) !== ')') {
      href += next();
    }

    // skip )
    next();

    return {
      type: 'link',
      href,
      children,
    };
  }

  function isHeading(index: number): boolean {
    let level = 0;

    if (peek(index) !== '#') {
      return false;
    }

    while (index < length && peek(index) === '#') {
      level++;
      index++;
    }

    if (level > 6) {
      return false;
    }

    if (peek(index) !== ' ') {
      return false;
    }

    return true;
  }

  function parseHeading(): HeadingNode {
    let level = 0;

    while (index < length && peek(index) === '#') {
      level++;
      next();
    }

    // Skip to beginning of text
    while (peek(index) === ' ') {
      next();
    }

    return {
      type: 'heading',
      level: level as HeadingNode['level'],
      children: parseSection(EOL),
    };
  }

  while (index < length) {
    const nodeType = peek(index);
    const match = peekAll(index).match(/^[\n ]*/);

    // Skip empty lines
    if (match && match[0]) {
      setIndex(index + match[0].length);
      continue;
    }

    if (nodeType === EOL) {
      next();
    }

    if (isHeading(index)) {
      ast.push(parseHeading());
      continue;
    }

    if (isList(index)) {
      ast.push(parseList());
      continue;
    }

    if (isCodeBlock(index)) {
      ast.push(parseCodeBlock());
      continue;
    }

    ast.push({
      type: 'paragraph',
      children: parseSection(),
    });
  }

  return ast;
}
