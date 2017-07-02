import * as _ from 'lodash';
import {
  ISignal,
  ISignalHandler,
  ISimpleEvent,
  ISimpleEventHandler,
  ISubscribable,
  SimpleEventDispatcher,
} from 'strongly-typed-events';

import * as N from './interfaces';

// export interface BufSubs<E, R=E> {
//   set_mode(mode:BufMode) : void;
//   get_mode() : BufMode;

//   // Dispatches any sent event immediately
//   immediate() : ISimpleEvent<E>;

//   // Dispatches the latest event on flush, if mode
//   // is latest_buffered
//   latest_buffered() : ISimpleEvent<LatestBuffered<E>>;

//   // Dispatches a list of all events on flush, if
//   // mode is list_buffered
//   list_buffered() : ISimpleEvent<ListBuffered<E>>;

//   // On flush: Dispatches a custom value generated from a start value, a
//   // reducer and all events since previous flush mode is
//   // custom_reducer_buffered
//   custom_reducer_buffered() : ISimpleEvent<
//       CustomReducerBuffered<E, R>>;
// }

// export interface BufDisp<E> {
//   flush() : void;
//   dispatch(arg:E) : void;
//   // If we wanted to match API of strongly-typed-events,
//   // we'd implement this but I think we don't:
//   // dispatchAsync(arg:E) : void;
// }

// Will return only the latest, most recent, event dispatched during the buffering period
// export interface LatestBuffered<E> {
//   last_event:E;
//   n_events:number;
// }

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

export function create_event_buffer<E, R=E, S=R>(spec:N.EventBufferSpec<E, R, S>) : N.EventBuffer<E, R> {
  return new EventBufferImpl<E, R, S>(spec);
}
