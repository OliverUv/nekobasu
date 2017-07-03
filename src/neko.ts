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
  'send',
  'flush',
  '_meta',
];

export function create_neko<E, EBD extends N.EventBufferDict<E>>(buffers:EBD) : EBD & N.Neko<E, keyof EBD> {
  const buffer_names:(keyof EBD)[] = Object.keys(buffers);
  let current_buffer:keyof EBD | undefined;

  _.forEach(buffer_names, (eb_name) => {
    if (_.includes(RESERVED_NAMES, eb_name)) {
      throw new Error(`Must not use the reserved name "${eb_name}" as a buffer name.`);
    }
  });

  function send(event:E) : void {
    if (current_buffer != undefined) {
      buffers[current_buffer].feed(event);
      return;
    }
    _.forEach(buffer_names, (buf_name) => buffers[buf_name].feed(event));
  }
  function clear() {
    _.forEach(buffer_names, (buf_name) => buffers[buf_name].clear());
  }
  function flush() {
    _.forEach(buffer_names, (buf_name) => buffers[buf_name].flush());
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

export function create_signal_neko<EBD extends N.EventBufferDict<undefined>>(buffers:EBD) : EBD & N.SignalNeko<keyof EBD> {
  const buffer_names:(keyof EBD)[] = Object.keys(buffers);
  let current_buffer:keyof EBD | undefined;

  _.forEach(buffer_names, (b_name) => {
    if (_.includes(RESERVED_NAMES, b_name)) {
      throw new Error(`Must not use the reserved name "${b_name}" as a buffer name.`);
    }
  });

  function clear() {
    _.forEach(buffer_names, (buf_name) => buffers[buf_name].clear());
  }
  function flush() {
    _.forEach(buffer_names, (buf_name) => buffers[buf_name].flush());
  }
  function send() : void {
    if (current_buffer != undefined) {
      buffers[current_buffer].feed(undefined);
      return;
    }
    _.forEach(buffer_names, (buf_name) => buffers[buf_name].feed(undefined));
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
