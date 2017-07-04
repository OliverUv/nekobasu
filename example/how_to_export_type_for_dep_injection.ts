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

import * as nbus from 'nekobasu';

// To export your Event Bus' type, you have to import and export many (all?)
// of the nekobasu types that make it up. TypeScript requires this for some
// reason.

import {
  EventBuffer,
  EventBus,
  EventCategories,
  Neko,
  SignalNeko
} from 'nekobasu/build/interfaces';
import {
  ISimpleEvent,
} from 'nekobasu/build/builtin_modifiers';
import {
  BuiltinEventNeko,
} from 'nekobasu/build/builtin';
import {
  InstrumentedLast
} from 'nekobasu/build/builtin_event_buffers';

export {
  EventBuffer,
  EventBus,
  EventCategories,
  InstrumentedLast,
  BuiltinEventNeko,
  Neko,
  SignalNeko,
  ISimpleEvent,
};

export function get_bus() {
  return nbus.event_bus.categorized({
    big_cat_events: nbus.event_bus.create({
      purr: nbus.builtin.signal(),
    }),
  });
}

// This bus is only created to help us export the type.
// We want the creation of the real/used event bus
// to be contained within the function, so that we
// can create multiple event buses if needed.
//
// See https://github.com/Microsoft/TypeScript/issues/6606
// for progress on how this hack could be avoided.

export let INVALID__DO_NOT_IMPORT = get_bus();
export type BusType = typeof INVALID__DO_NOT_IMPORT;
