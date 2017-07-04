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
import * as EB from './event_buffer';

export type ListBuffer<E> = N.EventBuffer<E, E[]>;

export function list<E>() : ListBuffer<E> {
  return EB.create_event_buffer<E, E[]>({
    reducer: (acc, next) => {
      acc.push(next);
      return acc;
    },
    start_value: [],
  });
}

export interface InstrumentedLast<E> {
  last_event:E;
  n_events_fired:number;
}

export type InstrumentedLastBuffer<E> = N.EventBuffer<E, InstrumentedLast<E>>;

export function instrumented_last<E>() : InstrumentedLastBuffer<E> {
  return EB.create_event_buffer<E, InstrumentedLast<E>, undefined>({
    reducer: (acc, next) => {
      if (acc == undefined) {
        return {
          last_event: next,
          n_events_fired: 1,
        };
      }
      return {
        last_event: next,
        n_events_fired: 1 + acc.n_events_fired,
      };
    },
    start_value: undefined,
  });
}

export type LastBuffer<E> = N.EventBuffer<E, E>;

export function last<E>() : LastBuffer<E> {
  return EB.create_event_buffer<E, E, undefined>({
    reducer: (acc, next) => {
      return next;
    },
    start_value: undefined,
  });
}

export type CountBuffer = N.EventBuffer<any, number>;

export function count() : CountBuffer {
  return EB.create_event_buffer<any, number>({
    reducer: (acc, next) => acc + 1,
    start_value: 0,
  });
}

export type ImmediateBuffer<E> = N.EventBuffer<E, E>;

export function immediate<E>() : ImmediateBuffer<E> {
  // We don't fulfill the requirement of supplying
  // reducer or start_value here, because we know
  // that the on_feed and on_flush tie-ins will let
  // us abort before these would be used.
  return EB.create_event_buffer<E, E>(<any>{
    before_flush: () => {
      return N.ShouldAbort.yes;
    },
    before_feed: (event:E, self:EB.EventBufferImpl<E, E>) => {
      self.dispatch(event);
      return N.ShouldAbort.yes;
    },
  });
}
