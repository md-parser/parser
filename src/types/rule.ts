import { ParserContext, StateContext } from '../parser';
import { MarkdownNodeBase } from './nodes';

export type Rule<T extends MarkdownNodeBase> = InlineRule<T> | BlockRule<T>;

type CommonRule<T extends MarkdownNodeBase> = {
  name: string;
  test: (state: Readonly<StateContext>) => boolean;
  parse: (state: Readonly<StateContext>, parser: ParserContext) => T;
};

export type InlineRule<T extends MarkdownNodeBase> = {
  type: 'inline' | 'inline-block';
  /**
   * Single character that can be used to start this rule
   */
  ruleStartChar: string | string[];
} & CommonRule<T>;

export type BlockRule<T extends MarkdownNodeBase> = {
  type: 'block';
} & CommonRule<T>;
