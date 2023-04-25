import { StateContext } from '../parser';

/**
 * Helper function to check if a rule ends with a valid closing in the same block.
 */
export function hasValidClosingInBlock(state: StateContext, char: string): boolean {
  const endOfRule = state.src.indexOf(char, state.position + char.length);
  const endOfBlock = state.src.indexOf('\n\n', state.position + char.length);

  if (endOfRule === -1) {
    return false;
  }

  const end = endOfBlock === -1 ? state.length : endOfBlock;

  return endOfRule < end;
}
