import * as N from './interfaces';
import * as EB from './event_buffer';

export function list<E>() {
  return EB.create_event_buffer<E, E[]>({
    reducer: (acc, next) => {
      acc.push(next);
      return acc;
    },
    start_value: [],
  });
}

// export interface LastInstrumentedBuffer<E> {
//   last_event:E;
// }

// export function last_instrumented<E>() {
//   return EB.create_event_buffer<E, LastInstrumentedBuffer<E>, undefined>({
//     reducer: (acc, next) => {
//       return {last_event: next};
//     },
//     start_value: undefined,
//   });
// }

export function last<E>() {
  return EB.create_event_buffer<E, E, undefined>({
    reducer: (acc, next) => {
      return next;
    },
    start_value: undefined,
  });
}

export function count() {
  return EB.create_event_buffer<any, number>({
    reducer: (acc, next) => acc + 1,
    start_value: 0,
  });
}

export function immediate<E>() {
  // We don't fulfill the requirement of supplying
  // reducer or start_value here, because we know
  // that the on_feed and on_flush tie-ins will let
  // us abort before these would be used.
  return EB.create_event_buffer<E, E>(<any>{
    before_flush: () => {
      return N.ShouldAbort.yes;
    },
    before_feed: (event:E, self:EB.EventBufferImpl<E,E>) => {
      self.dispatch(event);
      return N.ShouldAbort.yes;
    },
  });
}
