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

// export function last<E>() {
//   return EB.create_event_buffer<E, E>({
//     reducer: (acc, next) => {
//       acc.push(next);
//       return acc;
//     },
//     start_value: [],
//   });
// }

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
    on_flush: () => {
      return N.ShouldAbort.yes;
    },
    on_feed: (event:E, self:EB.EventBufferImpl<E,E>) => {
      self.dispatch(event);
      return N.ShouldAbort.yes;
    }
  });
}
