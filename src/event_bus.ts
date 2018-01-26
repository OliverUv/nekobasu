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

import _includes = require('lodash/includes');

import * as N from './interfaces';

const RESERVED_NAMES = [
  '_meta',
];

export function create<ND extends N.NekoDict>(nekos:ND) : ND & N.EventBus<keyof ND> {
  const neko_names:(keyof ND)[] = Object.keys(nekos);

  for (let i = 0; i < neko_names.length; i++) {
    const n_name = neko_names[i];
    if (_includes(RESERVED_NAMES, n_name)) {
      throw new Error(`Must not use the reserved name "${n_name}" as a buffer name.`);
    }
  }

  function clear() {
    for (let i = 0; i < neko_names.length; i++) {
      nekos[neko_names[i]]._meta.clear();
    }
  }

  function flush() {
    for (let i = 0; i < neko_names.length; i++) {
      nekos[neko_names[i]].flush();
    }
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

export function categorized<EBD extends N.EventBusDict>(ebs:EBD) : EBD & N.EventCategories<keyof EBD> {
  const eb_names:(keyof EBD)[] = Object.keys(ebs);

  for (let i = 0; i < eb_names.length; i++) {
    const name = eb_names[i];
    if (_includes(RESERVED_NAMES, name)) {
      throw new Error(`Must not use the reserved name "${name}" as an EventBus category name.`);
    }
  }

  function clear() {
    for (let i = 0; i < eb_names.length; i++) {
      ebs[eb_names[i]]._meta.clear();
    }
  }

  function flush() {
    for (let i = 0; i < eb_names.length; i++) {
      ebs[eb_names[i]]._meta.flush();
    }
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
