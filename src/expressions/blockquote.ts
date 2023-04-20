import { MarkdownExpression } from '../expression';
import { MarkdownBlockQuoteNode } from '../nodes';
import { SimpleMarkdownParser } from '../parser';
import { CodeExpression } from './code';
import { DividerExpression } from './divider';
import { EmphasisExpression } from './emphasis';
import { HeadingExpression } from './heading';
import { ImageExpression } from './image';
import { InlineCodeExpression } from './inlineCode';
import { LineBreakExpression } from './lineBreak';
import { LinkExpression } from './link';
import { ListExpression } from './list';
import { SubscriptExpression } from './subscript';
import { SuperscriptExpression } from './superscript';
import { TableExpression } from './table';

class BlockQuoteParser extends SimpleMarkdownParser {
  constructor(markdown: string) {
    super(markdown, [
      ListExpression,
      HeadingExpression,
      EmphasisExpression,
      LineBreakExpression,
      BlockquoteExpression,
      DividerExpression,
      LinkExpression,
      ImageExpression,
      InlineCodeExpression,
      CodeExpression,
      TableExpression,
      SuperscriptExpression,
      SubscriptExpression,
    ]);
  }

  public setMarkdown(markdown: string) {
    this.markdown = markdown;
    this.index = 0;
    this.length = markdown.length;
  }
}

export class BlockquoteExpression extends MarkdownExpression<MarkdownBlockQuoteNode> {
  public type = 'inline-block' as const;
  public name = 'blockquote';

  protected parser = new BlockQuoteParser('');

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
    this.parser.setMarkdown(value.replace(/^> ?/gm, ''));

    const children = this.parser.parse();

    return {
      type: 'blockquote',
      children: children,
    };
  }
}
