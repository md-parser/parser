import { MarkdownExpression } from '../expression';
import { MarkdownHeadingNode } from '../nodes';

export class HeadingExpression extends MarkdownExpression<MarkdownHeadingNode> {
  public type = 'block' as const;
  public name = 'heading';

  matches(): boolean {
    let level = 0;
    const length = 8; // More than 6 is not valid

    if (this.peek() !== '#') {
      return false;
    }

    while (level < length && this.peekAt(level) === '#') {
      level++;
    }

    if (level > 6) {
      return false;
    }

    return this.peekAt(level) === ' ';
  }

  toNode(): MarkdownHeadingNode {
    const level = this.peekLine().indexOf(' ');

    this.skip(level + 1);

    return {
      type: 'heading',
      level: level,
      children: this.parseInline(() => this.peek() === '\n'),
    };
  }
}
