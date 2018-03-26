// @flow

/**
 * Defines a common set of functionality all experiments must implement.
 */
export interface Experiment {
  getQuery(): string;
  processAnswer(arm: number, reward: number): void;
  load(): Promise<void>;
};
