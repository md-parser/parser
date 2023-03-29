import { MarkdownExpression } from '../expression';
import { MarkdownItalicNode, MarkdownStrikeTroughNode, MarkdownStrongNode } from '../nodes';

type EmphasisNode = MarkdownItalicNode | MarkdownStrikeTroughNode | MarkdownStrongNode;

export class EmphasisExpression extends MarkdownExpression<EmphasisNode> {
  public type = 'inline' as const;
  public name = 'emphasis';

  matches(): boolean {
    const char = this.peek();
    const value = this.buffer();

    if (char !== '*' && char !== '_' && char !== '~') {
      return false;
    }

    if (char === '~' && this.peekAt(1) !== '~') {
      return false;
    }

    if (this.peekAt(-1) === char && this.peekAt(-2) !== char) {
      return false;
    }

    const matchChars = this.peekAt(1) === char ? char + char : char;
    const endOfMatch = value.indexOf(matchChars, matchChars.length);
    const endOfLine = value.lastIndexOf('\n', endOfMatch);

    if (endOfMatch === -1) {
      return false;
    }

    return endOfLine === -1 ? true : endOfMatch < endOfLine;
  }

  toNode(): EmphasisNode {
    const symbol = this.peek();
    const doubleSymbol = this.peekAt(1) === symbol;

    if (doubleSymbol) {
      this.next();
      this.next();

      const children = this.parseInline(() => {
        return this.peekSet(0, 2) === symbol + symbol;
      });

      this.next();
      this.next();

      return {
        type: symbol === '~' ? 'strikeThrough' : 'strong',
        children,
      };
    }

    this.next();

    const children = this.parseInline(() => {
      return this.peek() === symbol;
    });

    this.next();

    return {
      type: 'italic',
      children: children,
    };
  }
}
