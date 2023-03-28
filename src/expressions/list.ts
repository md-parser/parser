import { MarkdownExpression } from '../expression';
import { MarkdownListNode } from '../nodes';

const LIST_ITEM_REGEX = /^[\t |]*(?:[*+-]|\d+\.) /;
export class ListExpression extends MarkdownExpression<MarkdownListNode> {
  public type = 'inline-block' as const;
  public name = 'list';

  isList(value: string): boolean {
    return LIST_ITEM_REGEX.test(value);
  }

  isOrderedList(value: string): boolean {
    return /^[\t |]*\d+. /.test(value);
  }

  getBull(value: string): string {
    const match = value.match(LIST_ITEM_REGEX);

    return match ? match[0] : '';
  }

  matches(): boolean {
    // Lists always start at the beginning of a line
    if (this.peekAt(-1) !== '\n' && this.peekAt(-1) !== '') {
      return false;
    }

    return this.isList(this.peekLine());
  }

  parseList(depth = 0): MarkdownListNode {
    const ordered = this.isOrderedList(this.buffer());
    const bull = this.getBull(this.buffer());

    const node: MarkdownListNode = {
      type: 'list',
      ordered,
      items: [],
    };

    if (ordered) {
      node.start = Number.parseInt(bull, 10);
    }

    while (this.isList(this.peekLine())) {
      const bull = this.getBull(this.buffer());
      const ordered = this.isOrderedList(this.buffer());
      let level = 0;

      while (level < bull.length && (bull.charAt(level) === ' ' || bull.charAt(level) === '\t')) {
        level++;
      }

      // Break current list parsing when next list entry changes from ordered to unordered or vice versa
      if (level === depth && node.ordered !== ordered) {
        break;
      }

      // Found list item at current depth
      if (level === depth) {
        this.skip(bull.length);

        node.items.push({
          type: 'list-item',
          children: this.parseInline(
            () =>
              (this.peek() === '\n' && this.peekAt(1) === '\n') ||
              this.isList(this.buffer().slice(1)),
          ),
        });

        if (this.peek() === '\n') {
          this.skip(1);
        }
      }

      if (level > depth) {
        node.items.push(this.parseList(level));
        continue;
      }

      if (level < depth) {
        break;
      }

      // Two line breaks, end of list
      if (this.peekAt(0) === '\n' && this.peekAt(1) === '\n') {
        break;
      }
    }

    return node;
  }

  toNode(): MarkdownListNode {
    const bull = this.getBull(this.buffer());
    let level = 0;

    while (level < bull.length && (bull.charAt(level) === ' ' || bull.charAt(level) === '\t')) {
      level++;
    }

    return this.parseList(level);
  }
}
