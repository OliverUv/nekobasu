// Copyright 2017 Oliver Uvman
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
