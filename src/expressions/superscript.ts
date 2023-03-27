import { MarkdownExpression } from '../expression';
import { MarkdownSuperscriptNode } from '../nodes';

export class SuperscriptExpression extends MarkdownExpression<MarkdownSuperscriptNode> {
  public type = 'inline' as const;
  public name = 'superscript';

  matches(): boolean {
    return this.peek() === '^' && /^\^([^^])+\^/.test(this.peekLine());
  }

  toNode(): MarkdownSuperscriptNode {
    // skip ^
    this.skip(1);

    const children = this.parseInline(() => {
      return this.peek() === '^';
    });

    // skip ^
    this.skip(1);

    return {
      type: 'superscript',
      children,
    };
  }
}
