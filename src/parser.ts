import { MarkdownExpression } from './expression';
import { BlockquoteExpression } from './expressions/blockquote';
import { CodeExpression } from './expressions/code';
import { DividerExpression } from './expressions/divider';
import { EmphasisExpression } from './expressions/emphasis';
import { HeadingExpression } from './expressions/heading';
import { ImageExpression } from './expressions/image';
import { InlineCodeExpression } from './expressions/inlineCode';
import { LineBreakExpression } from './expressions/lineBreak';
import { LinkExpression } from './expressions/link';
import { ListExpression } from './expressions/list';
import { SubscriptExpression } from './expressions/subscript';
import { SuperscriptExpression } from './expressions/superscript';
import { TableExpression } from './expressions/table';
import { MarkdownNode, MarkdownTextNode } from './nodes';
import { Expression } from './types';

const ESCAPE_CHARS = '!"#$%&\'()\\*+,-./:;<=>?@[]^_`{|}~';

export class SimpleMarkdownParser {
  protected length: number;
  protected index = 0;
  private readonly expressions: MarkdownExpression<MarkdownNode>[];

  // TODO Move markdown parameter to parse method?
  constructor(protected markdown: string, expressions: Expression[] = []) {
    this.markdown = markdown;
    this.length = markdown.length;
    this.expressions = expressions.map((expression) => new expression(this));
  }

  getMatchingExpression(type: 'block' | 'inline'): MarkdownExpression<MarkdownNode> | null {
    for (const expression of this.expressions) {
      if (
        (expression.type === type || expression.type === 'inline-block') &&
        expression.matches()
      ) {
        return expression;
      }
    }

    return null;
  }

  parseExpression(type: 'block' | 'inline'): MarkdownNode | null {
    const expression = this.getMatchingExpression(type);

    if (expression) {
      return expression.toNode();
    }

    return null;
  }

  parse(): MarkdownNode[] {
    const nodes: MarkdownNode[] = [];

    while (this.index < this.length) {
      if (this.peek() === '\n') {
        this.index++;
        continue;
      }

      nodes.push(this.parseBlock());
    }

    return nodes;
  }

  parseBlock(): MarkdownNode {
    // Try to parse a block expression from the start of the line
    let node = this.parseExpression('block');

    if (node) {
      return node;
    }

    const index = this.index;

    // No match, skip whitespace and try again
    while (
      this.index < this.length &&
      (this.peek() === ' ' || this.peek() === '\n' || this.peek() === '\t')
    ) {
      this.index++;
      continue;
    }

    // Try again
    if (this.index !== index) {
      node = this.parseExpression('block');

      if (node) {
        return node;
      }
    }

    return {
      type: 'paragraph',
      children: this.parseInline(() => {
        return this.peek() === '\n' && this.peekAt(1) === '\n';
      }),
    };
  }

  parseInline(predicate?: () => boolean): MarkdownNode[] {
    const nodes = [];

    while (this.index < this.length) {
      if (predicate && predicate()) {
        return nodes;
      }

      // Check for block expressions after a line break
      if (this.peek() === '\n') {
        this.next();

        if (this.getMatchingExpression('block')) {
          return nodes;
        }

        this.prev();
      }

      const node = this.parseExpression('inline');

      if (node) {
        nodes.push(node);
      }

      if (!node) {
        const textNode = this.parseText(predicate);

        if (textNode) {
          nodes.push(textNode);
        }
      }
    }

    return nodes;
  }

  parseText(predicate?: () => boolean): MarkdownTextNode | null {
    let value = '';
    let char = '';

    while ((char = this.peek())) {
      if (char === '\n') {
        break;
      }

      if (predicate && predicate()) {
        break;
      }

      if (this.getMatchingExpression('inline')) {
        break;
      }

      if (char === '\\') {
        // skip escape character
        this.next();

        // if the next character is not an escape character, add the escape character "back" to the text
        if (!ESCAPE_CHARS.includes(this.peek()) && !this.getMatchingExpression('inline')) {
          value += '\\';
        }
      }

      // Add the character to the text
      value += this.next();
    }

    if (value.length === 0) {
      return null;
    }

    return {
      type: 'text',
      value,
    };
  }

  buffer(): string {
    return this.markdown.slice(this.index);
  }

  next(): string {
    return this.markdown.charAt(this.index++);
  }

  prev(): string {
    return this.markdown.charAt(--this.index);
  }

  peek(): string {
    return this.markdown.charAt(this.index);
  }

  peekAt(index: number): string {
    return this.markdown.charAt(this.index + index);
  }

  peekSet(index: number, count: number): string {
    return this.markdown.slice(this.index + index, this.index + index + count);
  }

  peekLine(): string {
    const buffer = this.buffer();
    const newlineIndex = buffer.indexOf('\n');

    if (newlineIndex === -1) {
      return buffer;
    }

    return buffer.slice(0, Math.max(0, newlineIndex));
  }

  readUntil(predicate: () => boolean): string {
    let value = '';

    while (this.index < this.length && !predicate()) {
      value += this.next();
    }

    return value;
  }

  skip(count: number): void {
    this.index += count;
  }

  skipUntil(predicate: () => boolean): void {
    while (this.index < this.length && !predicate()) {
      this.index++;
    }
  }
}
export class MarkdownParser extends SimpleMarkdownParser {
  constructor(markdown: string, expressions: Expression[] = []) {
    super(markdown, [
      ListExpression,
      HeadingExpression,
      EmphasisExpression,
      LineBreakExpression,
      BlockquoteExpression,
      DividerExpression,
      LinkExpression,
      ImageExpression,
      InlineCodeExpression,
      CodeExpression,
      TableExpression,
      SuperscriptExpression,
      SubscriptExpression,
      ...expressions,
    ]);
  }
}
