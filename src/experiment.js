// @flow

export interface Experiment {
  getQuery(): string;
  processAnswer(arm: number, reward: number): void;
  load(): Promise<void>;
};
