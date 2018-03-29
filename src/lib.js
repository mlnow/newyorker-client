// @flow

/**
 * A sum type of possible experiment types.
 */
type AppTypes = 'cardinalbandits';

import type {Experiment} from './experiment';
import {CardinalBandits} from './apps/cardinalbandits';

/**
 * Dispatches experiment creation and initialization.
 *
 * This is the primary entry point into the NEXT library when manually wiring
 * page elements up.
 */
export function experiment(appType: AppTypes, expUid: string,
                       settings: {apiBase?: string, stateBase?: string}): Experiment
{
  const apiBase = settings.apiBase || 'https://n5b3n0mgj2.execute-api.us-west-2.amazonaws.com/dev';
  const stateBase = settings.stateBase || 'https://s3-us-west-2.amazonaws.com/next2-cardinalbandits';
  switch (appType) {
    case 'cardinalbandits': {
      return new CardinalBandits(expUid, {apiBase,
        priorityList: `${stateBase}/${expUid}/priority_list.json`,
        targets: `${stateBase}/${expUid}/targets.json`});
    };
    default: throw new Error('Unknown app type!');
  }
}
