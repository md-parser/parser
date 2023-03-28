import { MarkdownExpression } from '../expression';
import { MarkdownDividerNode } from '../nodes';

export class DividerExpression extends MarkdownExpression<MarkdownDividerNode> {
  public type = 'block' as const;
  public name = 'divider';

  matches(): boolean {
    return /^\s*[*-_]{3}\s*$/.test(this.peekLine());
  }

  toNode(): MarkdownDividerNode {
    this.skipUntil(() => this.peek() === '\n');

    return {
      type: 'divider',
    };
  }
}
