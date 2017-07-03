import * as nbus from './';

import {
  EventBus,
  EventBuffer,
  EventCategories,
  SignalNeko,
  BaseNeko,
} from './';

export {
  EventBus,
  EventBuffer,
  EventCategories,
  SignalNeko,
  BaseNeko,
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
export let INVALID_DO_NOT_IMPORT = get_bus();
export type BusType = typeof INVALID_DO_NOT_IMPORT;
