import { LexerState } from './lexer2';

export type Rule = {
  name: string;
  type: 'block' | 'inline';
  terminatedBy?: string[];
  parse: (state: LexerState) => boolean;
};

export function createRule(rule: Rule) {
  return rule;
}
