import { MarkdownExpression } from '../expression';
import { MarkdownInlineCodeNode } from '../nodes';

export class InlineCodeExpression extends MarkdownExpression<MarkdownInlineCodeNode> {
  public type = 'inline' as const;
  public name = 'inlineCode';

  matches(): boolean {
    if (this.peek() !== '`') {
      return false;
    }

    return this.peekAt(1) !== '`' && this.peekAt(-1) !== '`' && this.peekLine().includes('`', 1);
  }

  toNode(): MarkdownInlineCodeNode {
    // skip `
    this.skip(1);

    const value = this.readUntil(() => this.peek() === '`');

    // skip `
    this.skip(1);

    return {
      type: 'inlineCode',
      value,
    };
  }
}
