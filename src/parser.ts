import { blockquoteRule } from './rules/blockquote';
import { codeRule } from './rules/code';
import { commentRule } from './rules/comment';
import { dividerRule } from './rules/divider';
import { emphasisRule } from './rules/emphasis';
import { headingRule } from './rules/heading';
import { imageRule } from './rules/image';
import { inlineCodeRule } from './rules/inlineCode';
import { lineBreakRule } from './rules/lineBreak';
import { linkRule } from './rules/link';
import { listRule } from './rules/list';
import { strongRule } from './rules/strong';
import { tableRule } from './rules/table';
import { MarkdownNode, MarkdownTextNode } from './types/nodes';
import { Rule } from './types/rule';

const ESCAPE_CHARS = '!"#$%&\'()\\*+,-./:;<=>?@[]^_`{|}~';

export type ParserConfig = {
  presets?: Rule<MarkdownNode>[] | Rule<MarkdownNode>[][];
};

export type StateContext = {
  // Markdown string
  src: string;
  // Position of the current character
  position: number;
  // Starting pPosition of the current line
  lineStart: number;
  // Number of characters that indenting the current line
  indent: number;
  // Length of the markdown string
  length: number;

  charAt: (offset: number) => string;
  slice: (position: number, length?: number) => string;
};

export type ParserContext = {
  skip: (position: number) => void; // progress
  skipUntil: (predicate: (char: string) => boolean) => void; // progressUntil
  parseInline: (predicate: () => boolean) => MarkdownNode[];
  readUntil: (predicate: (char: string) => boolean) => string;
  parse: (src: string) => MarkdownNode[];
  parseIndentation: () => void;
};

export function mdAST(config: ParserConfig = {}) {
  const rules: Rule<MarkdownNode>[] = [
    codeRule, // codeRule needs to be the first rule, or not?...
    strongRule,
    emphasisRule,
    linkRule,
    imageRule,
    lineBreakRule,
    dividerRule,
    inlineCodeRule,
    headingRule,
    listRule,
    tableRule,
    blockquoteRule,
    commentRule,
  ];

  if (config.presets) {
    rules.push(...config.presets.flat());
  }

  // Set of characters that can be used to start a rule
  // We use this to quickly skip over characters that can't start a rule
  const specialChars = new Set<string>(
    rules.flatMap((rule) => ('ruleStartChar' in rule ? rule.ruleStartChar : [])),
  );
  const ruleStartChars = [...specialChars].join('');

  // Parser state
  const state: StateContext = {
    src: '',
    position: 0,
    lineStart: 0,
    indent: 0,
    length: 0,
    charAt,
    slice,
  };
  // Parser context - these functions are used by rules to progress the parser
  const parserContext: ParserContext = {
    skip,
    skipUntil,
    parseInline,
    readUntil,
    parseIndentation,
    parse: parseSubTree,
  };

  // Cached version of the parser has a nice performance boost for larger markdown strings
  let parserInstance: ReturnType<typeof mdAST>;

  /**
   * Parse the given markdown string from within a rule
   */
  function parseSubTree(src: string) {
    if (!parserInstance) {
      parserInstance = mdAST(config);
    }

    return parserInstance.parse(src);
  }

  // Cache entry for the current state.chatAt(0) call
  const charAtCache = {
    position: -1,
    value: '',
  };

  /**
   * Get the character at the given position relative to the current position
   */
  function charAt(position: number) {
    const index = state.position + position;

    // Ignore cache if we are not "current" position
    if (position !== 0) {
      return state.src.charAt(index);
    }

    if (index !== charAtCache.position) {
      charAtCache.position = index;
      charAtCache.value = state.src.charAt(index);
    }

    return charAtCache.value;
  }

  function slice(position: number, length?: number) {
    if (length === undefined) {
      return state.src.slice(state.position + position);
    }

    return state.src.slice(state.position + position, state.position + position + length);
  }

  /**
   * Set the current position from within a rule, useful when moving the position
   * forward manually in a rule
   */
  function skip(position: number) {
    state.position = state.position + position;
  }

  /**
   * Progress the position until the predicate returns true
   */
  function skipUntil(predicate: (char: string) => boolean) {
    while (state.position < state.length) {
      if (predicate(charAt(0))) {
        break;
      }

      state.position += 1;
    }
  }

  /**
   * Read and advance the position until the predicate returns true
   * Returns the read string
   */
  function readUntil(predicate: (char: string) => boolean) {
    const start = state.position;

    while (state.position < state.length) {
      if (predicate(charAt(0))) {
        break;
      }

      state.position += 1;
    }

    return state.src.slice(start, state.position);
  }

  /**
   * Find a rule by type
   */
  function findRule(type: 'block' | 'inline'): Rule<MarkdownNode> | null {
    // If the current character can't start a rule, return null
    if (type === 'inline' && !ruleStartChars.includes(charAt(0))) {
      return null;
    }

    for (const rule of rules) {
      if ((rule.type === type || rule.type === 'inline-block') && rule.test(state)) {
        return rule;
      }
    }

    return null;
  }

  function parseIndentation() {
    state.indent = 0;

    while (state.position < state.length) {
      const char = charAt(0);

      if (char === '\n') {
        state.indent = 0;
        state.lineStart = state.position + 1;
        state.position += 1;
      } else if (char === ' ') {
        state.indent += 1;
        state.position += 1;
      } else if (char === '\t') {
        state.indent += 4;
        state.position += 1;
      } else {
        break;
      }
    }
  }

  function parseBlock(): MarkdownNode | null {
    // Parse newlines / indentation
    parseIndentation();

    // Check if we're at the end of the document
    if (state.position >= state.length) {
      return null;
    }

    // Check if we're at the start of a block
    const rule = findRule('block');

    if (rule) {
      return rule.parse(state, parserContext);
    }

    // No block found, parse as paragraph
    return {
      type: 'paragraph',
      children: parseInline(() => {
        return charAt(0) === '\n' && (charAt(1) === '\n' || charAt(1) === '');
      }),
    };
  }

  function parseInline(predicate: () => boolean): MarkdownNode[] {
    const nodes: MarkdownNode[] = [];

    while (state.position < state.length) {
      if (predicate()) {
        return nodes;
      }

      // Check if we're at the start of a block
      if (charAt(0) === '\n') {
        parseIndentation();

        // Block found, return nodes
        if (findRule('block')) {
          return nodes;
        }

        // No block found, revert parseIndentation
        state.position = state.lineStart - 1;
        state.indent = 0;
      }

      const inlineRule = findRule('inline');

      if (inlineRule) {
        nodes.push(inlineRule.parse(state, parserContext));
      } else {
        const textNode = parseText(predicate);

        if (textNode) {
          nodes.push(textNode);
        }
      }
    }

    return nodes;
  }

  function parseText(predicate: () => boolean): MarkdownTextNode | null {
    let value = '';
    let char = '';

    while ((char = charAt(0))) {
      if (predicate()) {
        break;
      }

      // If is escaped char, ignore \ and add next char. Then skip to start of loop
      if (char === '\\' && ESCAPE_CHARS.includes(charAt(1))) {
        value += charAt(1);
        state.position += 2;
        continue;
      }

      // Check if we're at the start of an inline rule
      if (findRule('inline')) {
        break;
      }

      value += char;

      state.position++;
    }

    if (!value) {
      return null;
    }

    return {
      type: 'text',
      value,
    };
  }

  function parse(src: string): MarkdownNode[] {
    state.src = src;
    state.length = src.length;
    state.position = 0;

    const nodes: MarkdownNode[] = [];
    let node: MarkdownNode | null;

    while ((node = parseBlock())) {
      nodes.push(node);
    }

    return nodes;
  }

  return {
    parse,
  };
}
