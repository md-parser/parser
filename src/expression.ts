import { MarkdownNode, MarkdownNodeBase } from './nodes';
import { MarkdownParser } from './parser';

export abstract class MarkdownExpression<T extends MarkdownNodeBase> {
  public abstract name: string;
  public abstract type: 'block' | 'inline' | 'inline-block';

  protected parser: MarkdownParser;

  constructor(parser: MarkdownParser) {
    this.parser = parser;
  }

  abstract matches(): boolean;
  abstract toNode(): T;

  protected parseInline(predicate?: () => boolean): MarkdownNode[] {
    return this.parser.parseInline(predicate);
  }

  protected buffer(): string {
    return this.parser.buffer();
  }

  next(): string {
    return this.parser.next();
  }

  protected peek(): string {
    return this.parser.peek();
  }

  protected peekAt(index: number): string {
    return this.parser.peekAt(index);
  }

  protected peekSet(index: number, count: number): string {
    return this.parser.peekSet(index, count);
  }

  protected peekLine(): string {
    return this.parser.peekLine();
  }

  protected skip(count: number): void {
    this.parser.skip(count);
  }

  protected skipUntil(predicate: () => boolean): void {
    this.parser.skipUntil(predicate);
  }

  protected readUntil(predicate: () => boolean): string {
    return this.parser.readUntil(predicate);
  }
}
