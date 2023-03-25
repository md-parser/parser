import { MarkdownExpression } from './expression';
import { BlockquoteExpression } from './expressions/blockquote';
import { CodeExpression } from './expressions/codeblock';
import { DividerExpression } from './expressions/divider';
import { EmphasisExpression } from './expressions/emphasis';
import { HeadingExpression } from './expressions/heading';
import { ImageExpression } from './expressions/image';
import { InlineCodeExpression } from './expressions/inlineCode';
import { LineBreakExpression } from './expressions/lineBreak';
import { LinkExpression } from './expressions/link';
import { ListExpression } from './expressions/list';
import { MarkdownNode, MarkdownTextNode } from './nodes';
import { Expression } from './types';

export class MarkdownParser {
  private expressions: MarkdownExpression<MarkdownNode>[];
  private readonly markdown: string;
  private length: number;
  private index = 0;

  // TODO Move markdown parameter to parse method?
  constructor(markdown: string, expressions: Expression[] = []) {
    this.markdown = markdown;
    this.length = markdown.length;

    this.expressions = [
      new ListExpression(this),
      new HeadingExpression(this),
      new EmphasisExpression(this),
      new LineBreakExpression(this),
      new BlockquoteExpression(this),
      new DividerExpression(this),
      new LinkExpression(this),
      new ImageExpression(this),
      new InlineCodeExpression(this),
      new CodeExpression(this),
      ...expressions.map((expression) => new expression(this)),
    ];
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
    const node = this.parseExpression('block');

    if (node) {
      return node;
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
        // console.log('predicate kill', JSON.stringify(this.buffer()));
        return nodes;
      }

      // Beginning of new block
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

      value += char;
      this.next();
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

  peekFromStartOfLine(): string {
    const buffer = this.buffer();
    const newlineIndex = buffer.lastIndexOf('\n', this.index);

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

  skipWhitespace(): void {
    this.skipUntil(() => this.peek() !== ' ');
  }
}
