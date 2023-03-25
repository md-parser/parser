import { MarkdownExpression } from '../expression';
import { MarkdownListItemNode, MarkdownListNode } from '../nodes';

const LIST_ITEM_REGEX = /^[\t |]*(?:[*+-]|\d+.) /;
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
    // peekFromStartOfLine() ?
    return this.isList(this.peekLine());
  }

  toNode(): MarkdownListNode {
    const node: MarkdownListNode = {
      type: 'list',
      ordered: this.isOrderedList(this.buffer()),
      children: this.parseListItems(),
    };

    //

    return node;
  }

  parseListItems(depth = 0): MarkdownListItemNode[] {
    const nodes: MarkdownListItemNode[] = [];

    while (this.isList(this.buffer())) {
      const bull = this.getBull(this.buffer());
      let level = 0;

      while (this.peekAt(level) === ' ' || this.peekAt(level) === '\t') {
        level++;
      }

      if (level !== depth) {
        console.log('<-->', level);
        break;
      }

      this.skip(bull.length);

      nodes.push({
        type: 'list-item',
        children: this.parseInline(() => {
          return (this.peek() === '\n' && this.peekAt(1) === '\n') || this.isList(this.buffer());
        }),
      });

      // throw new Error('Not implemented');

      // this.next();

      // if (this.peek() === '\n') {
      //   this.index++;
      //   continue;
      // }

      // if (!this.isList(this.peekLine())) {
      //   break;
      // }

      // items.push(this.parseListItem());
    }

    return nodes;
  }
}
