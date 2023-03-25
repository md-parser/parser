import { EOL } from '../constants';
import { MarkdownExpression } from '../expression';
import { MarkdownLineBreakNode } from '../nodes';

export class LineBreakExpression extends MarkdownExpression<MarkdownLineBreakNode> {
  public type = 'inline' as const;
  public name = 'line-break';

  matches(): boolean {
    return this.peek() === EOL;
  }

  toNode(): MarkdownLineBreakNode {
    this.skip(1);

    return {
      type: 'line-break',
    };
  }
}
