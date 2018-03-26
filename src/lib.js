// @flow

type AppTypes = 'cardinalbandits';

import type {Experiment} from './experiment';
import {CardinalBandits} from './apps/cardinalbandits';

export function inject(appType: AppTypes, expUid: string,
                       settings: {apiBase?: string, stateBase?: string}): Experiment
{
  const apiBase = settings.apiBase || 'https://3nvq6ef1ri.execute-api.us-west-2.amazonaws.com/test';
  const stateBase = settings.stateBase || 'https://d3pi6g4o3df8d3.cloudfront.net';
  switch (appType) {
    case 'cardinalbandits': {
      return new CardinalBandits(expUid, {apiBase,
        priorityList: `${stateBase}/${expUid}/priority_list.json`,
        targets: `${stateBase}${expUid}/targets.json`});
    };
    default: throw new Error('Unknown app type!');
  }
}
