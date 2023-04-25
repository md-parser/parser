import { State } from '../parser';
import { MarkdownNodeBase } from './nodes';

export type Rule<T extends MarkdownNodeBase> = InlineRule<T> | BlockRule<T>;

export type InlineRule<T extends MarkdownNodeBase> = {
  type: 'inline' | 'inline-block';
  name: string;
  /**
   * Single character that can be used to start this rule
   */
  specialChars: string | string[];
  test: (state: Readonly<State>) => boolean;
  parse: (state: Readonly<State>) => T;
};

export type BlockRule<T extends MarkdownNodeBase> = {
  type: 'block';
  name: string;
  test: (state: Readonly<State>) => boolean;
  parse: (state: Readonly<State>) => T;
};
