import { EOL } from '../constants';
import { MarkdownExpression } from '../expression';
import { MarkdownDividerNode } from '../nodes';

export class DividerExpression extends MarkdownExpression<MarkdownDividerNode> {
  public type = 'block' as const;
  public name = 'divider';

  matches(): boolean {
    return this.peekSet(0, 3) === '---' && (this.peekAt(3) === EOL || this.peekAt(3) === '');
  }

  toNode(): MarkdownDividerNode {
    this.skip(3);

    return {
      type: 'divider',
    };
  }
}
