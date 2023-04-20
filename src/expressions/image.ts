import { MarkdownExpression } from '../expression';
import { MarkdownImageNode } from '../nodes';

const IMAGE_REGEX = /^!\[.*]\(.*\)/;

export class ImageExpression extends MarkdownExpression<MarkdownImageNode> {
  public type = 'inline' as const;
  public name = 'image' as const;

  matches(): boolean {
    if (this.peek() !== '!') {
      return false;
    }

    return IMAGE_REGEX.test(this.buffer());
  }

  toNode(): MarkdownImageNode {
    // skip ![
    this.skip(2);

    const alt = this.readUntil(() => this.peek() === ']');

    // skip ](
    this.skip(2);

    const src = this.readUntil(() => this.peek() === '"' || this.peek() === ')').trimEnd();
    let title: string | undefined;

    if (this.peek() === '"') {
      this.skip(1);

      title = this.readUntil(() => this.peek() === '"');
    }

    this.skipUntil(() => this.peek() === ')');

    // skip )
    this.skip(1);

    return {
      type: 'image',
      alt,
      src,
      title,
    };
  }
}
