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

import { test } from 'ava';

import * as nbus from '../';

test.todo(`Write tests that explore basic signals`);
test.todo(`Write tests that explore basic events`);
test.todo(`Write tests that explore writing one's own nekos and event buffers`);

/**
 * See the file ../../example/how_to_export_type_for_dep_injection.ts
 * to learn how to export the type of an event bus created inside a
 * function.
 */
test(async function multiple_buses_with_types_infered_from_factory_function(t) {
  t.plan(2);

  function create_bus() {
    return nbus.event_bus.categorized({
      big_cat_events: nbus.event_bus.create({
        purr: nbus.builtin.signal(),
      }),
    });
  }

  const one = create_bus();

  const two = create_bus();
  const three = create_bus();

  one.big_cat_events.purr.immediate.one(() => t.pass());
  two.big_cat_events.purr.immediate.sub(() => t.fail());

  one.big_cat_events.purr.send();

  one.big_cat_events.purr.immediate.sub(() => t.fail());
  three.big_cat_events.purr.immediate.sub(() => t.pass());

  three.big_cat_events.purr.send();
});
