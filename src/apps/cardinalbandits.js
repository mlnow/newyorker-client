// @flow

import type {Experiment} from '../experiment';
import {randomString} from '../util';
import axios from 'axios';

/**
 * Contains logic and front-end algorithms for a Cardinal Bandits experiment.
 *
 * @param expUid the experiment ID
 * @param urls URLs to the backend
 */
export class CardinalBandits implements Experiment {
  expUid: string;
  participantUid: string;
  // URLs to data we need
  urls: {apiBase: string, targets: string, priorityList: string};

  // list of targets.
  targets: string[] = [];
  // a list encoding the priority of sampling each arm. the first element is
  // the most important arm to sample.
  priorityList: number[] = [];
  // a pointer to our current location in the priority list.
  priorityPtr: number = 0;
  // caption indices we've seen.
  seen: number[] = [];

  constructor(expUid: string, urls: {
                apiBase: string, targets: string, priorityList: string
              })
  {
    this.expUid = expUid;
    this.urls = urls;

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

  async _loadTargets(url: string): Promise<string[]> {
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

  /**
   * Gets a new query to display to the user, in the string form which we'll
   * show to them as, eg, a caption.
   */
  getQuery(): string {
    // if the priority list is empty (haven't recieved one yet) or if we've
    // exhausted all the arms, pick a random arm. otherwise, perform the normal
    // sampling procedure.
    const idx = ((this.priorityList.length === 0 || (this.seen.length >= this.targets.length))) ? (
      Math.floor(Math.random()*this.targets.length)
    ) : (
      this.priorityList[this.priorityPtr++]
    );

    return this.targets[idx];
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
