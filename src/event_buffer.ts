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
import {
  SimpleEventDispatcher,
} from 'strongly-typed-events';

import * as N from './interfaces';

/**
 * For reducing a stream of events to a single value to be
 * emitted on flush. `start_value` must be `_.cloneDeep`able.
 */
export class EventBufferImpl<E, R=E, S=R> extends SimpleEventDispatcher<R> implements N.EventBuffer<E, R> {
  // If dirty is true, we know reduced_value has been
  // changed. We cast to <R> instead of checking that it
  // isn't undefined, because it might be that undefined
  // is an acceptable R value to the library user.
  private reduced_value?:R;
  private dirty:boolean;
  private spec:N.EventBufferSpec<E, R, S>;

  public constructor(spec:N.EventBufferSpec<E, R, S>) {
    super();
    this.spec = spec;
    this.clear();
  }

  public flush() {
    if (this.spec.before_flush != undefined) {
      if (this.spec.before_flush(this) == N.ShouldAbort.yes) { return; }
    }
    if (this.dirty == false) { return; }
    this.dispatch(<R>this.reduced_value);
    this.clear();
  }

  public feed(event:E) {
    if (this.spec.before_feed != undefined) {
      if (this.spec.before_feed(event, this) == N.ShouldAbort.yes) { return; }
    }
    // TODO Provide upstream patch to make it possible to
    // get the number of subscriptions that a
    // DispatcherBase has
    if ((<any>this)._subscriptions.length == 0) { return; }
    if (this.dirty == false) {
      this.reduced_value = this.spec.reducer(
          _.cloneDeep(this.spec.start_value),
          event);
    } else {
      this.reduced_value = this.spec.reducer(
          <R>this.reduced_value,
          event);
    }
    this.dirty = true;
  }

  public clear() : void {
    // Though we know the reduced_value parameter
    // won't be used before it's overwritten by a
    // proper value, we make sure to release our
    // reference to it in case it's a large object.
    this.reduced_value = undefined;
    this.dirty = false;
  }
}

export function create<E, R=E, S=R>(spec:N.EventBufferSpec<E, R, S>) : N.EventBuffer<E, R> {
  return new EventBufferImpl<E, R, S>(spec);
}
