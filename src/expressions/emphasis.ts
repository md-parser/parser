import { MarkdownExpression } from '../expression';
import { MarkdownItalicNode, MarkdownStrikeTroughNode, MarkdownStrongNode } from '../nodes';

type EmphasisNode = MarkdownItalicNode | MarkdownStrikeTroughNode | MarkdownStrongNode;

export class EmphasisExpression extends MarkdownExpression<EmphasisNode> {
  public type = 'inline' as const;
  public name = 'emphasis';

  private nested = false;
  private prevNested = false;

  restoreNested() {
    this.nested = this.prevNested;
  }

  setNested() {
    this.prevNested = this.nested;
    this.nested = true;

    return this.prevNested;
  }

  matches(): boolean {
    const char = this.peek();

    // Emphasis matches '*' or '_' or '~'
    if (char !== '*' && char !== '_' && char !== '~') {
      return false;
    }

    // Striketrough matches '~~'
    if (char === '~' && this.peekAt(1) !== '~') {
      return false;
    }

    const line = this.buffer();
    const symbol = this.peekAt(1) === char && this.peekAt(2) !== char ? char + char : char;

    if (symbol.length === 2) {
      return line.includes(symbol, 2);
    }

    let nextSymbolIndex = line.indexOf(symbol, symbol.length + 1);

    while (nextSymbolIndex !== -1) {
      if (this.peekAt(nextSymbolIndex - 1) !== char) {
        return true;
      }

      nextSymbolIndex = line.indexOf(symbol, nextSymbolIndex + 1);
    }

    return false;
  }

  toNode(): EmphasisNode {
    const symbol = this.peek(); // '*' or '_' or '~'

    if (this.peekAt(1) === symbol) {
      // skip symbol
      this.next();
      this.next();

      const prevNested = this.nested;
      this.nested = true;
      const children = this.parseInline(() => {
        return this.peekSet(0, 2) === symbol + symbol;
      });
      this.nested = prevNested;

      // skip symbol
      this.next();
      this.next();

      return {
        type: symbol === '~' ? 'strikeThrough' : 'strong',
        children,
      };
    }

    // skip symbol
    this.next();

    const nested = this.setNested();

    const children = this.parseInline(() => {
      if (!nested && this.peek() === symbol) {
        return this.peekAt(1) !== symbol;
      }

      return this.peek() === symbol;
    });

    this.restoreNested();

    this.next();

    return {
      type: 'italic',
      children: children,
    };
  }
}
