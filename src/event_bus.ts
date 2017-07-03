import * as _ from 'lodash';

import * as N from './interfaces';

const RESERVED_NAMES = [
  '_meta',
];

export function create<ND extends N.NekoDict>(nekos:ND) : ND & N.EventBus<keyof ND> {
  const neko_names:(keyof ND)[] = Object.keys(nekos);

  _.forEach(neko_names, (n_name) => {
    if (_.includes(RESERVED_NAMES, n_name)) {
      throw new Error(`Must not use the reserved name "${n_name}" as a buffer name.`);
    }
  });

  function clear() {
    _.forEach(neko_names, (n) => { nekos[n]._meta.clear(); });
  }

  function flush() {
    _.forEach(neko_names, (n) => { nekos[n].flush(); });
  }

  const event_bus:N.EventBus<keyof ND> = {
    _meta: {
      clear,
      flush,
    },
  };

  return {
    ...event_bus,
    ...(<any>nekos),
  };
}

export function categorized_buses<EBD extends N.EventBusDict>(ebs:EBD) : EBD & N.EventCategories<keyof EBD> {
  const eb_names:(keyof EBD)[] = Object.keys(ebs);

  _.forEach(eb_names, (name) => {
    if (_.includes(RESERVED_NAMES, name)) {
      throw new Error(`Must not use the reserved name "${name}" as an EventBus category name.`);
    }
  });

  function clear() {
    _.forEach(eb_names, (n) => { ebs[n]._meta.clear(); });
  }

  function flush() {
    _.forEach(eb_names, (n) => { ebs[n]._meta.flush(); });
  }

  const event_bus:N.EventCategories<keyof EBD> = {
    _meta: {
      clear,
      flush,
    },
  };

  return {
    ...event_bus,
    ...(<any>ebs),
  };
}
