import { MarkdownExpression } from '../expression';
import { MarkdownSubscriptNode } from '../nodes';

const SUBSCRIPT_REGEX = /^~([^~])+~/;

export class SubscriptExpression extends MarkdownExpression<MarkdownSubscriptNode> {
  public type = 'inline' as const;
  public name = 'subscript' as const;

  matches(): boolean {
    return this.peek() === '~' && SUBSCRIPT_REGEX.test(this.peekLine());
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
