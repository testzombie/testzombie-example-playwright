export enum MutationLevel {
  OFF = 0,
  LIGHT = 1,
  REALISTIC = 2,
  HARD = 3,
  EXTREME = 4,
}

export const ALL_MUTATION_LEVELS: readonly MutationLevel[] = [
  MutationLevel.OFF,
  MutationLevel.LIGHT,
  MutationLevel.REALISTIC,
  MutationLevel.HARD,
  MutationLevel.EXTREME,
];

export function mutationLevelName(level: MutationLevel): string {
  return MutationLevel[level];
}

export function baselineSuffix(level: MutationLevel): string {
  return level === MutationLevel.OFF ? ' @baseline' : '';
}
