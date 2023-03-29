import { MarkdownExpression } from '../expression';
import { MarkdownHeadingNode } from '../nodes';

export class HeadingExpression extends MarkdownExpression<MarkdownHeadingNode> {
  public type = 'block' as const;
  public name = 'heading';

  matches(): boolean {
    if (this.peek() !== '#') {
      return false;
    }

    const match = this.buffer().match(/^(#{1,6})\s/);

    if (!match) {
      return false;
    }

    if (match[1].length > 6) {
      return false;
    }

    return true;
  }

  toNode(): MarkdownHeadingNode {
    this.skipUntil(() => this.peek() === '#');

    const level = this.peekLine().indexOf(' ');

    this.skip(level + 1);

    return {
      type: 'heading',
      level: level as 1 | 2 | 3 | 4 | 5 | 6,
      children: this.parseInline(() => this.peek() === '\n'),
    };
  }
}
