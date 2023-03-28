import { MarkdownExpression } from '../expression';
import { MarkdownBlockQuoteNode } from '../nodes';
import { MarkdownParser } from '../parser';

export class BlockquoteExpression extends MarkdownExpression<MarkdownBlockQuoteNode> {
  public type = 'inline-block' as const;
  public name = 'blockquote';

  matches(): boolean {
    if (this.peek() !== '>') {
      return false;
    }

    if (this.peekAt(-1) !== '\n' && this.peekAt(-1) !== '') {
      return false;
    }

    return this.peekAt(1) === ' ' || this.peekAt(1) === '>';
  }

  toNode(): MarkdownBlockQuoteNode {
    // Read until the next newline that isn't a blockquote
    const value = this.readUntil(() => {
      if (this.peek() === '\n' && this.peekAt(1) !== '>') {
        return true;
      }

      return false;
    });

    // Remove the > from the start of each line
    const cleanValue = value.replace(/^> ?/gm, '');
    // Parse the contents of the blockquote
    const parser = new MarkdownParser(cleanValue);
    const children = parser.parse();

    return {
      type: 'blockquote',
      children: children,
    };
  }
}
