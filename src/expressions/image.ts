import { MarkdownExpression } from '../expression';
import { MarkdownImageNode } from '../nodes';

export class ImageExpression extends MarkdownExpression<MarkdownImageNode> {
  public type = 'inline' as const;
  public name = 'image';

  matches(): boolean {
    if (this.peek() !== '!') {
      return false;
    }

    return /^!\[.*]\(.*\)/.test(this.buffer());
  }

  toNode(): MarkdownImageNode {
    // skip ![
    this.skip(2);

    const alt = this.readUntil(() => this.peek() === ']');

    // skip ](
    this.skip(2);

    const src = this.readUntil(() => this.peek() === ')');

    // skip )
    this.skip(1);

    return {
      type: 'image',
      alt,
      src,
    };
  }
}
