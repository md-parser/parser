import { MarkdownExpression } from '../expression';
import { MarkdownSubscriptNode } from '../nodes';

export class SubscriptExpression extends MarkdownExpression<MarkdownSubscriptNode> {
  public type = 'inline' as const;
  public name = 'subscript';

  matches(): boolean {
    return this.peek() === '~' && /^~([^~])+~/.test(this.peekLine());
  }

  toNode(): MarkdownSubscriptNode {
    // skip ~
    this.skip(1);

    const children = this.parseInline(() => {
      return this.peek() === '~';
    });

    // skip ~
    this.skip(1);

    return {
      type: 'subscript',
      children,
    };
  }
}
