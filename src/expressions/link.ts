import { EOL } from '../constants';
import { MarkdownExpression } from '../expression';
import { MarkdownLinkNode } from '../nodes';

export class LinkExpression extends MarkdownExpression<MarkdownLinkNode> {
  public type = 'inline' as const;
  public name = 'link';

  matches(): boolean {
    if (this.peek() !== '[') {
      return false;
    }

    // check if there is a space before the link
    if (this.peekAt(-1) !== ' ' && this.peekAt(-1) !== '' && this.peekAt(-1) !== EOL) {
      return false;
    }

    return /^\[.*]\(.*\)/.test(this.buffer());
  }

  toNode(): MarkdownLinkNode {
    // skip [
    this.skip(1);

    const children = this.parseInline(() => {
      return this.peek() === ']' || this.peek() === EOL;
    });

    // skip ](
    this.skip(2);

    const href = this.readUntil(() => this.peek() === ')');

    // skip )
    this.skip(1);

    return {
      type: 'link',
      href,
      children,
    };
  }
}
