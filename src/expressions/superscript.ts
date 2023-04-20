import { MarkdownExpression } from '../expression';
import { MarkdownSuperscriptNode } from '../nodes';

const SUPERSCRIPT_REGEX = /^\^([^^])+\^/;

export class SuperscriptExpression extends MarkdownExpression<MarkdownSuperscriptNode> {
  public type = 'inline' as const;
  public name = 'superscript';

  matches(): boolean {
    return this.peek() === '^' && SUPERSCRIPT_REGEX.test(this.peekLine());
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
