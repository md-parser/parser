import { BreakNode, HeadingNode, ImageNode, LinkNode, Node, TextNode } from './nodes';

export function parse(markdown: string): Node[] {
  const ast: Node[] = [];

  let index = 0;
  const length = markdown.length;

  function peek(index: number) {
    return markdown[index];
  }

  function next() {
    return markdown[index++];
  }

  function skipEmpty() {
    while (index < length && (peek(index) === ' ' || peek(index) === '\n')) {
      index++;
    }
  }

  function parseText(): TextNode {
    let value = '';

    while (index < length && !isSpecialChar(index)) {
      // Remove escape character
      if (peek(index) === '\\' && isSpecialChar(index + 1, true)) {
        next();
      }

      value += next();
    }

    return {
      type: 'text',
      value,
    };
  }

  function parseSection(): Node[] {
    const nodes = [];

    while (index < length) {
      if (peek(index) === '\n' && peek(index + 1) === '\n') {
        break;
      }

      if (isSpecialChar(index)) {
        const node = parseSpecial();

        if (!node) {
          break;
        }

        nodes.push(node);
        continue;
      }

      nodes.push(parseText());
    }

    return nodes;
  }

  function isSpecialChar(index: number, skipEscape = false): boolean {
    const char = peek(index);
    const next = peek(index + 1);

    if (!skipEscape && peek(index - 1) === '\\') {
      return false;
    }

    return (
      char === '#' ||
      char === '*' ||
      char === '\n' ||
      (char === '!' && next === '[') ||
      char === '['
    );
  }

  function parseSpecial(): Node | void {
    const char = peek(index);

    // if (char === '*') {
    //   return parseList();
    // }

    if (char === '\n' && peek(index + 1) !== '\n') {
      return parseBreak();
    }

    if (char === '!' && peek(index + 1) === '[') {
      return parseImage();
    }

    if (char === '[') {
      return parseLink();
    }

    console.log('!WQWE', JSON.stringify(char), JSON.stringify(markdown.slice(index, index + 2)));
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

  function parseHeading(): HeadingNode {
    let level = 0;

    while (index < length && peek(index) === '#') {
      level++;
      next();
    }

    // skip space
    next();

    return {
      type: 'heading',
      level,
      // TODO parse section should that on line ending
      children: parseSection(),
    };
  }

  // Skip whitespaces and newlines
  skipEmpty();

  while (index < length) {
    const nodeType = peek(index);
    // console.log('->', JSON.stringify(nodeType));

    if (nodeType === '#') {
      ast.push(parseHeading());
      continue;
    }

    if (nodeType === ' ' || nodeType === '\n') {
      next();
      continue;
    }

    const section = parseSection();

    if (section.length === 1 && section[0].type === 'heading') {
      ast.push(section[0]);
    } else {
      ast.push({
        type: 'paragraph',
        children: section,
      });
    }
  }

  return ast;
}
