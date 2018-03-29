// @flow

import axios from 'axios';

type Target = {
  primary_description: string;
};

/**
 * Contains logic and front-end algorithms for a Caption Contest (Cardinal Bandits experiment).
 *
 * @param expUid the experiment ID
 * @param urls URLs to the backend
 */
export class Experiment {
  expUid: string;
  participantUid: string;
  // URLs to data we need
  urls: {apiBase: string, targets: string, priorityList: string};

  // list of targets.
  targets: Target[] = [];
  // a list encoding the priority of sampling each arm. the first element is
  // the most important arm to sample.
  priorityList: number[] = [];
  // a pointer to our current location in the priority list.
  priorityPtr: number = 0;
  // caption indices we've seen.
  seen: number[] = [];
  // the current arm
  currentArm: number;

  constructor(expUid: string, settings: {apiBase?: string, stateBase?: string} = {}) {
    this.expUid = expUid;
    const apiBase = settings.apiBase || 'https://n5b3n0mgj2.execute-api.us-west-2.amazonaws.com/dev';
    const stateBase = settings.stateBase || 'https://s3-us-west-2.amazonaws.com/next2-cardinalbandits';
    this.urls = {
      apiBase,
      priorityList: `${stateBase}/${expUid}/priority_list.json`,
      targets: `${stateBase}/${expUid}/targets.json`
    };

    // derive the participant id. if this user has already visited, they will
    // have a pid stored in localStorage, which we can simply retrieve. if not,
    // we generate a new pid and store it.
    const storedId = localStorage.getItem('participantUid');
    if (storedId) {
      this.participantUid = storedId;
    } else {
      this.participantUid = randomString(30);
      localStorage.setItem('participant_uid', this.participantUid);
    }
  }

  async _loadTargets(url: string): Promise<Target[]> {
    const response = await axios.get(url);
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      return Promise.reject(new Error("didn't recieve expected type"));
    }
  }

  async _loadPriorityList(url: string): Promise<number[]> {
    const response = await axios.get(url);
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      return Promise.reject(new Error("didn't recieve expected type"));
    }
  }

  /**
   * Load data necessary to run the sampling algorithm.
   *
   * @return {Promise<void>} a unit Promise conditional on the completion
   * of all data loading.
   */
  async load() {
    this.targets = await this._loadTargets(this.urls.targets);
    this.priorityList = await this._loadPriorityList(this.urls.priorityList);
  }

  init(cb: () => void) {
    this.load().then(cb);
  }

  /**
   * Gets a new query to display to the user.
   */
  getQuery(): string {
    // mirrors the proxy
    const N = this.priorityList.length;
    let k = this.priorityPtr++ % N;
    let idx;

    while ((k < N) && (this.seen.indexOf(this.priorityList[k]) != -1)) {
      k++;
    }

    if (k == N) {
      idx = Math.floor(Math.random()*N);
    } else {
      idx = this.priorityList[k];
    }

    this.currentArm = idx;
    this.seen.push(idx);
    return this.targets[idx]['primary_description'];
  }

  /**
   * Processes a user's response to a query, sending an arm index and a reward
   * to the backend.
   *
   * @param idx the index of the arm which the user pulled.
   * @param reward the reward assigned to the arm by the user.
   */
  processAnswer(idx: number, reward: number) {
    axios.post(`${this.urls.apiBase}/processAnswer`, {
      exp_uid: this.expUid,
      target_id: idx, target_reward: reward,
      participant_uid: this.participantUid,
    });
  }
}

/**
 * Returns a random string of length `len`, sampling with replacement from `chars`.
 */
function randomString(len: number, chars: string = "0123456789abcdef"): string {
  let str = "";
  chars = chars;
  for (let i=0; i<len; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }

  return str;
};
