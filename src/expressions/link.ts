import { EOL } from '../constants';
import { MarkdownExpression } from '../expression';
import { MarkdownLinkNode } from '../nodes';

const LINK_REGEX = /^\[.*]\(.*\)/;

export class LinkExpression extends MarkdownExpression<MarkdownLinkNode> {
  public type = 'inline' as const;
  public name = 'link' as const;

  matches(): boolean {
    if (this.peek() !== '[') {
      return false;
    }

    return LINK_REGEX.test(this.buffer());
  }

  toNode(): MarkdownLinkNode {
    // skip [
    this.skip(1);

    const children = this.parseInline(() => {
      return this.peek() === ']' || this.peek() === EOL;
    });

    // skip ](
    this.skip(2);

    const href = this.readUntil(() => this.peek() === '"' || this.peek() === ')').trimEnd();
    let title: string | undefined;

    if (this.peek() === '"') {
      this.skip(1);

      title = this.readUntil(() => this.peek() === '"');
    }

    this.skipUntil(() => this.peek() === ')');

    // skip )
    this.skip(1);

    return {
      type: 'link',
      href,
      title,
      children,
    };
  }
}
