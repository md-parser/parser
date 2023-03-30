import { EOL } from '../constants';
import { MarkdownExpression } from '../expression';
import { MarkdownCodeNode } from '../nodes';

const CODE_INDENT = '    ';
const CODE_BACKTICKS = '```';

export class CodeExpression extends MarkdownExpression<MarkdownCodeNode> {
  public type = 'block' as const;
  public name = 'code';

  matches(): boolean {
    if (this.peekSet(0, 4) === CODE_INDENT && /^ {4}([^\n$]+)/.test(this.buffer())) {
      return true;
    }

    return this.peekSet(0, 3) === CODE_BACKTICKS && this.buffer().includes(CODE_BACKTICKS, 3);
  }

  toNode(): MarkdownCodeNode {
    if (this.peekSet(0, 4) === CODE_INDENT) {
      const match = this.buffer().match(/^( {4}[^\n]+(?:\n|$))+/g);

      if (!match) {
        this.skip(4);

        return {
          type: 'code',
          value: '',
        };
      }

      const raw = match[0];
      const value = raw.replace(/^(\s{4})/gm, '');

      this.skip(raw.length);

      return {
        type: 'code',
        value: value,
      };
    }

    // skip ```
    this.skip(3);

    const language = this.readUntil(() => this.peek() === EOL) || undefined;

    // skip newline
    this.skip(1);

    const value = this.readUntil(() => this.peekSet(0, 3) === CODE_BACKTICKS);

    // skip ```
    this.skip(3);

    return {
      type: 'code',
      language,
      value: value,
    };
  }
}
