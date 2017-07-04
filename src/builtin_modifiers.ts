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

import { create_neko, create_signal_neko } from './neko';
import * as N from './interfaces';
import * as EB from './builtin_event_buffers';
import * as BI from './builtin';

import * as event_buffers from './builtin_event_buffers';
import { ISimpleEvent } from 'strongly-typed-events';
export { event_buffers, ISimpleEvent };

export function event_as_public<E>(eb:BI.BuiltinEventNeko<E>) {
  return {
    immediate: <ISimpleEvent<E>>eb.immediate,
    instrumented_last: <ISimpleEvent<EB.InstrumentedLast<E>>>eb.instrumented_last,
    last: <ISimpleEvent<E>>eb.last,
    list: <ISimpleEvent<E[]>>eb.list,
  };
}

export function signal_as_public(eb:BI.BuiltinSignalNeko) {
  return {
    immediate: <ISimpleEvent<undefined>>eb.immediate,
    count: <ISimpleEvent<number>>eb.count,
  };
}

export function merge_ebs<
    E,
    A extends N.EventBufferDict<E>,
    B extends N.EventBufferDict<E>
    > (a:A, b:B) : A & B {
  const a_keys = _.keys(a);
  const b_keys = _.keys(b);
  const shared_key = _.find(a_keys, (ak) => _.includes(b_keys, ak));
  if (shared_key != undefined) {
    throw new Error(`Attempted to merge two EventBuffer dictionaries with duplicate key ${shared_key}.`)
  }
  
  return {
    ...<any>a,
    ...<any>b,
  };
}
