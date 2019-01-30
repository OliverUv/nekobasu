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

import * as N from './interfaces';
import * as EB from './builtin_event_buffers';
import * as BI from './builtin';

// Forced re-export
import { ISimpleEvent } from 'strongly-typed-events';
export { ISimpleEvent };

export function builtin_event_as_public<E>(eb:BI.BuiltinEventNeko<E>) {
  return {
    immediate: <ISimpleEvent<E>>eb.immediate,
    instrumented_last: <ISimpleEvent<EB.InstrumentedLast<E>>>eb.instrumented_last,
    last: <ISimpleEvent<E>>eb.last,
    list: <ISimpleEvent<E[]>>eb.list,
  };
}

export function builtin_signal_as_public(eb:BI.BuiltinSignalNeko) {
  return {
    immediate: <ISimpleEvent<undefined>>eb.immediate,
    count: <ISimpleEvent<number>>eb.count,
  };
}

export function merge_event_buffers<
    E,
    A extends N.EventBufferDict<E>,
    B extends N.EventBufferDict<E>
    > (a:A, b:B) : A & B {
  const a_keys = Object.keys(a);
  const b_keys = Object.keys(b);

  for (let i = 0; i < a_keys.length; i++) {
    const a_key = a_keys[i];
    for (let j = 0; j < b_keys.length; j++) {
      const b_key = b_keys[j];
      if (a_key == b_key) {
        throw new Error(`Attempted to merge two EventBuffer dictionaries with duplicate key ${a_key}.`);
      }
    }
  }

  return {
    ...<any>a,
    ...<any>b,
  };
}

export function clone_deep<T>(o:T) : T {
   let output:any;
   output = Array.isArray(o) ? [] : {};
   for (const key in o) {
     const v = o[key];
     output[key] = (typeof v === 'object') ? clone_deep(v) : v;
   }
   return output;
}
