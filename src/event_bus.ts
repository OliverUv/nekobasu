import * as _ from 'lodash';

import * as N from './interfaces';

const RESERVED_NAMES = [
  'neko',
];

export function create<ND extends N.NekoDict>(nekos:ND) : ND & N.EventBus<keyof ND> {
  let neko_names:Array<keyof ND> = Object.keys(nekos);

  _.forEach(neko_names, (n_name) => {
    if (_.includes(RESERVED_NAMES, n_name)) {
      throw new Error(`Must not use the reserved name "${n_name}" as a buffer name.`);
    }
  })

  function clear() {
    _.forEach(neko_names, (n) => { nekos[n].neko.clear(); });
  }

  function flush() {
    _.forEach(neko_names, (n) => { nekos[n].flush(); });
  }

  let event_bus:N.EventBus<keyof ND> = {
    neko:{
      clear,
      flush,
    }
  };

  return {
    event_bus,
    ...(<any>nekos),
  };
}
