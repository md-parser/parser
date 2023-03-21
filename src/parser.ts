import {
  BreakNode,
  CodeBlockNode,
  HeadingNode,
  ImageNode,
  InlineCodeNode,
  ItalicNode,
  LinkNode,
  Node,
  OrderedListNode,
  StrongNode,
  TextNode,
  UnorderedListNode,
} from './nodes';

const ESCAPE = '\\';
const EOL = '\n';

export function parse(markdown: string): Node[] {
  const ast: Node[] = [];

  let index = 0;
  const length = markdown.length;

  //
  function debug() {
    console.log('debug', JSON.stringify(markdown.slice(index)));
  }

  function peek(index: number) {
    return markdown[index];
  }

  function peekPart(index: number, length: number) {
    return markdown.slice(index, index + length);
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

  function parseSection(stopAtChar?: string): Node[] {
    const nodes = [];
    const stopAtCharLength = stopAtChar ? stopAtChar.length : 0;

    while (index < length) {
      if (stopAtChar && peekPart(index, stopAtCharLength) === stopAtChar) {
        setIndex(index + stopAtCharLength);
        break;
      }

      if (peek(index) === EOL && peek(index + 1) === EOL) {
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
    const char = peek(index);

    if ((char === '*' || char === '-' || char === '+') && peek(index + 1) === ' ') {
      return true;
    }

    return false;
  }

  // TODO Add support for nested lists
  function parseUnorderedList(): UnorderedListNode {
    const node: UnorderedListNode = {
      type: 'unordered-list',
      children: [],
    };

    while (index < length && isUnorderedList(index)) {
      // Skip '* '
      next();
      next();

      node.children.push({
        type: 'list-item',
        // TODO Should spawn over multiple lines, then check for EOL+EOL or EOL+NEWLINE
        children: parseSection(EOL),
      });

      // Two line breaks, end of list
      if (peek(index - 1) === EOL && peek(index) === EOL) {
        break;
      }

      skipEmpty();
    }

    return node;
  }

  function isOrderedList(index: number): boolean {
    return /\d/.test(peek(index)) && peek(index + 1) === '.' && peek(index + 2) === ' ';
  }

  function parseOrderedList(): OrderedListNode {
    const node: OrderedListNode = {
      type: 'ordered-list',
      children: [],
    };

    while (index < length && isOrderedList(index)) {
      // Skip '1. '
      next();
      next();
      next();

      node.children.push({
        type: 'list-item',
        // TODO Should spawn over multiple lines, then check for EOL+EOL or EOL+NEWLINE
        children: parseSection(EOL),
      });

      // Two line breaks, end of list
      if (peek(index - 1) === EOL && peek(index) === EOL) {
        break;
      }

      skipEmpty();
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

  function parseRawValue(chars: string): string {
    const start = index + chars.length;
    const end = markdown.indexOf(chars, start);

    setIndex(end + chars.length);

    return markdown.slice(start, end);
  }

  function isInlineCode(index: number): boolean {
    return peek(index) === '`' && lookAhead('`', index + 1);
  }

  function parseInlineCode(): InlineCodeNode {
    return {
      type: 'inline-code',
      value: parseRawValue('`'),
    };
  }

  function isCodeBlock(index: number): boolean {
    return peekPart(index, 3) === '```' && lookAhead('```', index + 3);
  }

  function parseCodeBlock(): InlineCodeNode | CodeBlockNode {
    return {
      type: 'code-block',
      value: parseRawValue('```'),
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

  function parseBreak(): BreakNode | void {
    // skip ' ' and '\n'
    skipEmpty();

    if (index >= length) {
      return;
    }

    return {
      type: 'break',
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
    let value = '';
    let href = '';

    // skip [
    next();

    while (index < length && peek(index) !== ']') {
      value += next();
    }

    // skip ]
    next();

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
      children: [
        {
          type: 'text',
          value,
        },
      ],
    };
  }

  function isHeading(index: number): boolean {
    let level = 0;

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

    skipEmptySpaces();

    return {
      type: 'heading',
      level,
      children: parseSection(EOL),
    };
  }

  while (index < length) {
    const nodeType = peek(index);

    if (nodeType === ' ' || nodeType === EOL) {
      next();
      continue;
    }

    if (nodeType === '#' && isHeading(index)) {
      ast.push(parseHeading());
      continue;
    }

    if (isHeading(index)) {
      ast.push(parseHeading());
      continue;
    }

    if (isUnorderedList(index)) {
      ast.push(parseUnorderedList());
      continue;
    }

    if (isOrderedList(index)) {
      ast.push(parseOrderedList());
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
