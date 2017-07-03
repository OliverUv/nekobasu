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
import * as event_buffer from './builtin_event_buffers';
export { event_buffer }

export function event<E>() {
  const spec = {
    immediate: event_buffer.immediate<E>(),
    instrumented_last: event_buffer.instrumented_last<E>(),
    last: event_buffer.last<E>(),
    list: event_buffer.list<E>(),
  };

  return create_neko<E, typeof spec>(spec);
}

export function signal() {
  const spec = {
    count: event_buffer.count(),
    immediate: event_buffer.immediate<undefined>(),
  };

  return create_signal_neko<typeof spec>(spec);
}
