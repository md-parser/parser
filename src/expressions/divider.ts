import { MarkdownExpression } from '../expression';
import { MarkdownDividerNode } from '../nodes';

const DIVIDER_REGEX = /^\s*[*_-]{3,}\s*$/;

export class DividerExpression extends MarkdownExpression<MarkdownDividerNode> {
  public type = 'block' as const;
  public name = 'divider' as const;

  matches(): boolean {
    const char = this.peek();

    if (char !== '*' && char !== '_' && char !== '-') {
      return false;
    }

    return DIVIDER_REGEX.test(this.peekLine());
  }

  toNode(): MarkdownDividerNode {
    this.skipUntil(() => this.peek() === '\n');

    return {
      type: 'divider',
    };
  }
}
