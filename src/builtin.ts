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

import { create_neko, create_signal_neko } from './neko';
import * as N from './interfaces';
import * as EB from './builtin_event_buffers';

import * as event_buffers from './builtin_event_buffers';
export { event_buffers }
import * as modify from './builtin_modifiers';
export { modify };

export interface BuiltinEventEventBuffers<E> {
  immediate: EB.ImmediateBuffer<E>;
  instrumented_last: EB.InstrumentedLastBuffer<E>;
  last: EB.LastBuffer<E>;
  list: EB.ListBuffer<E>;
}

export interface BuiltinSignalEventBuffers {
  immediate: EB.ImmediateBuffer<undefined>;
  count: EB.CountBuffer;
}

export interface BuiltinEventNeko<E> extends BuiltinEventEventBuffers<E>, N.Neko<E, keyof BuiltinEventEventBuffers<E>> {}
export interface BuiltinSignalNeko extends BuiltinSignalEventBuffers, N.Neko<undefined, keyof BuiltinSignalEventBuffers> {}

export function event_ebs<E>() {
  return {
    immediate: EB.immediate<E>(),
    instrumented_last: EB.instrumented_last<E>(),
    last: EB.last<E>(),
    list: EB.list<E>(),
  };
}

export function event<E>() : BuiltinEventNeko<E> {
  let eb_dict = event_ebs<E>();
  return create_neko<E, typeof eb_dict>(eb_dict);
}

export function signal() {
  const eb_dict = {
    count: EB.count(),
    immediate: EB.immediate<undefined>(),
  };

  return create_signal_neko<typeof eb_dict>(eb_dict);
}
