import {
  blockquoteRule,
  codeRule,
  headingRule,
  hrRule,
  listRule,
  paragraphRule,
} from './blockRules';
import { emphasisRule, inlineCodeRule, strongRule, textRule } from './inlineRules';
import { Rule } from './rules';

export enum TokenType {
  HeadingStart = 'HeadingStart',
  HeadingEnd = 'HeadingEnd',
  InlineStart = 'InlineStart',
  InlineEnd = 'InlineEnd',
  Text = 'Text',
  ParagraphStart = 'ParagraphStart',
  ParagraphEnd = 'ParagraphEnd',
  EmphasisStart = 'EmphasisStart',
  EmphasisEnd = 'EmphasisEnd',
  StrongStart = 'StrongStart',
  StrongEnd = 'StrongEnd',
  HorizontalRule = 'HorizontalRule',
  BlockquoteStart = 'BlockquoteStart',
  BlockquoteEnd = 'BlockquoteEnd',
  CodeStart = 'CodeStart',
  CodeEnd = 'CodeEnd',
  InlineCode = 'InlineCode',
}

export type Token = {
  tag: string;
  type: TokenType;
  start: number;
  value?: string;
};

export type InlineToken = {
  type: 'inline';
  content: string;
  children: Tokens[];
  start: number;
};

export type Tokens = Token | InlineToken;

export type LexerState = {
  src: string;
  cursor: number;
  length: number;
  testForTermination: (rule: string) => boolean;
  mode: 'block' | 'inline';
  tokens: Tokens[];
};

export const blockRules: Rule[] = [
  hrRule,
  headingRule,
  blockquoteRule,
  codeRule,
  listRule,
  paragraphRule,
];
export const inlineRules: Rule[] = [strongRule, emphasisRule, inlineCodeRule, textRule];
export const rules = [...blockRules, ...inlineRules];

export function lexer(src: string, mode: LexerState['mode'] = 'block') {
  // const tokens: Token[] = [];
  const state: LexerState = {
    src,
    cursor: 0,
    length: src.length,
    mode: 'block',
    tokens: [],
    testForTermination: (ruleName) => {
      const terminatedBy = rules.find(({ name }) => name === ruleName)?.terminatedBy;

      if (!terminatedBy) {
        return false;
      }

      for (const rule of rules) {
        if (terminatedBy.includes(rule.name) && rule.parse(state)) {
          return true;
        }
      }

      return false;
    },
  };

  function findRule(type: 'block' | 'inline') {
    let prevCursor = state.cursor;

    for (const rule of rules) {
      if (rule.type === type && rule.parse(state)) {
        if (prevCursor === state.cursor) {
          throw new Error(`Rule '${rule.name}' did not consume any characters`);
        }

        return rule;
      }
    }

    return null;
  }

  // Tokenize all block elements
  while (state.cursor < state.length) {
    const rule = findRule(mode || state.mode);

    if (!rule) {
      throw new Error(`No rule found ${state.src[state.cursor]}`);
    }
  }

  // Parse inline elements
  for (const token of state.tokens) {
    if (token.type === 'inline') {
      token.children = lexer(token.content, 'inline');
    }
  }

  return state.tokens;
}

const tokens = lexer('___BLPE___*l*');
// ```kek`blep\n> SOEP\n## HI\n> More Soep\n\nNew para
console.log(JSON.stringify(tokens, null, 2));
