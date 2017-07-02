import { create_neko, create_signal_neko } from './neko';
import * as N from './interfaces';
import * as event_buffer from './builtin_event_buffers';
export { event_buffer }

export function event<E>() {
  let spec = {
    immediate: event_buffer.immediate<E>(),
    last: event_buffer.last<E>(),
    list: event_buffer.list<E>(),
  };

  return create_neko<E, typeof spec>(spec);
}

export function signal() {
  let spec = {
    count: event_buffer.count(),
    immediate: event_buffer.immediate<undefined>(),
  };

  return create_signal_neko<typeof spec>(spec);
}
