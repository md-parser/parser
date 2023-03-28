import { EOL } from '../constants';
import { MarkdownExpression } from '../expression';
import { MarkdownCodeNode } from '../nodes';

export class CodeExpression extends MarkdownExpression<MarkdownCodeNode> {
  public type = 'block' as const;
  public name = 'code';

  matches(): boolean {
    return this.peekSet(0, 3) === '```' && this.buffer().includes('```', 3);
  }

  toNode(): MarkdownCodeNode {
    // skip ```
    this.skip(3);

    const language = this.readUntil(() => this.peek() === EOL);

    // skip newline
    this.skip(1);

    const value = this.readUntil(() => this.peekSet(0, 3) === '```');

    this.skip(3);

    return {
      type: 'code',
      language: language,
      value: value,
    };
  }
}
