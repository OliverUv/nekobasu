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

import * as nbus from './';

// To export your Event Bus' type, you have to import and export many (all?)
// of the nekobasu types that make it up. TypeScript requires this for some
// reason.

import {
  BaseNeko,
  EventBuffer,
  EventBus,
  EventCategories,
  Neko,
  SignalNeko,
} from 'nekobasu';
import { InstrumentedLast } from 'nekobasu/build/builtin_event_buffers';

export {
  BaseNeko,
  EventBuffer,
  EventBus,
  EventCategories,
  InstrumentedLast,
  Neko,
  SignalNeko,
};

export function get_bus() {
  return nbus.categorized_buses({
    big_cat_events: nbus.create({
      purr: nbus.builtin.signal(),
    }),
  });
}

// This bus is only created to help us export the type.
// We want the creation of the real/used event bus
// to be contained within the function, so that we
// can create multiple event buses if needed.

export let INVALID__DO_NOT_IMPORT = get_bus();
export type BusType = typeof INVALID__DO_NOT_IMPORT;
