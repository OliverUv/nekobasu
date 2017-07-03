import * as _ from 'lodash';

import * as N from './interfaces';

const RESERVED_NAMES = [
  'signal',
  'dispatch',
  'flush',
  'neko',
];

export function create_neko<E, EBD extends N.EventBufferDict<E>>(buffers:EBD) : EBD & N.Neko<E, keyof EBD> {
  let buffer_names:Array<keyof EBD> = Object.keys(buffers);
  let current_buffer:keyof EBD | undefined;

  _.forEach(buffer_names, (b_name) => {
    if (_.includes(RESERVED_NAMES, b_name)) {
      throw new Error(`Must not use the reserved name "${b_name}" as a buffer name.`);
    }
  })

  function dispatch(event:E) : void {
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

  let neko:N.Neko<E, keyof EBD> = {
    dispatch,
    flush,
    neko: {
      clear,
      get_current_used_buffer,
      use_all_buffers,
      use_single_buffer,
    },
  };

  return {
    ...neko,
    ...(<any>buffers),
  }
}

// TODO Refactor create_signal_neko, it shares most of its implementation details with create_neko

export function create_signal_neko<EBD extends N.EventBufferDict<undefined>>(buffers:EBD) : EBD & N.SignalNeko<keyof EBD> {
  let buffer_names:Array<keyof EBD> = Object.keys(buffers);
  let current_buffer:keyof EBD | undefined;

  _.forEach(buffer_names, (b_name) => {
    if (_.includes(RESERVED_NAMES, b_name)) {
      throw new Error(`Must not use the reserved name "${b_name}" as a buffer name.`);
    }
  })

  function clear() {
    _.forEach(buffer_names, (buf_name) => buffers[buf_name].clear());
  }
  function flush() {
    _.forEach(buffer_names, (buf_name) => buffers[buf_name].flush());
  }
  function signal() : void {
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

  let neko:N.SignalNeko<keyof EBD> = {
    flush,
    signal,
    neko: {
      clear,
      get_current_used_buffer,
      use_all_buffers,
      use_single_buffer,
    },
  };

  return {
    ...neko,
    ...(<any>buffers),
  }
}
