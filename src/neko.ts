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
  'send',
  'flush',
  '_meta',
];

export function create_for_event<E, EBD extends N.EventBufferDict<E>>(buffers:EBD) : EBD & N.Neko<E, keyof EBD> {
  const buffer_names:(keyof EBD)[] = Object.keys(buffers);
  let current_buffer:keyof EBD | undefined;

  for (let i = 0; i < buffer_names.length; i++) {
    const eb_name = buffer_names[i];
    if (_includes(RESERVED_NAMES, eb_name)) {
      throw new Error(`Must not use the reserved name "${eb_name}" as a buffer name.`);
    }
  }

  function send(event:E) : void {
    if (current_buffer != undefined) {
      buffers[current_buffer].feed(event);
      return;
    }
    for (let i = 0; i < buffer_names.length; i++) {
      buffers[buffer_names[i]].feed(event);
    }
  }
  function clear() {
    for (let i = 0; i < buffer_names.length; i++) {
      buffers[buffer_names[i]].clear();
    }
  }
  function flush() {
    for (let i = 0; i < buffer_names.length; i++) {
      buffers[buffer_names[i]].flush();
    }
  }
  function use_single_buffer(buffer_name:keyof EBD) : void {
    clear();
    current_buffer = buffer_name;
  }
  function use_all_buffers() {
    clear();
    current_buffer = undefined;
  }
  function get_current_used_buffer() {
    return current_buffer;
  }

  const neko:N.Neko<E, keyof EBD> = {
    send,
    flush,
    _meta: {
      clear,
      get_current_used_buffer,
      use_all_buffers,
      use_single_buffer,
    },
  };

  return {
    ...neko,
    ...(<any>buffers),
  };
}

// TODO Refactor create_signal_neko, it shares most of its implementation details with create_neko
// TODO Don't create new clear, flush etc functions for each neko, let multiple nekos share these

export function create_for_signal<EBD extends N.EventBufferDict<undefined>>(buffers:EBD) : EBD & N.SignalNeko<keyof EBD> {
  const buffer_names:(keyof EBD)[] = Object.keys(buffers);
  let current_buffer:keyof EBD | undefined;

  for (let i = 0; i < buffer_names.length; i++) {
    const b_name = buffer_names[i];
    if (_includes(RESERVED_NAMES, b_name)) {
      throw new Error(`Must not use the reserved name "${b_name}" as a buffer name.`);
    }
  }

  function clear() {
    for (let i = 0; i < buffer_names.length; i++) {
      buffers[buffer_names[i]].clear();
    }
  }
  function flush() {
    for (let i = 0; i < buffer_names.length; i++) {
      buffers[buffer_names[i]].flush();
    }
  }
  function send() : void {
    if (current_buffer != undefined) {
      buffers[current_buffer].feed(undefined);
      return;
    }
    for (let i = 0; i < buffer_names.length; i++) {
      buffers[buffer_names[i]].feed(undefined);
    }
  }
  function use_single_buffer(buffer_name:keyof EBD) : void {
    clear();
    current_buffer = buffer_name;
  }
  function use_all_buffers() {
    clear();
    current_buffer = undefined;
  }
  function get_current_used_buffer() {
    return current_buffer;
  }

  const neko:N.SignalNeko<keyof EBD> = {
    flush,
    send,
    _meta: {
      clear,
      get_current_used_buffer,
      use_all_buffers,
      use_single_buffer,
    },
  };

  return {
    ...neko,
    ...(<any>buffers),
  };
}
