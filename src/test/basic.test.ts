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

test(async function one_signal(t) {
  t.plan(1);

  let event_bus = {
    event_name: nbus.builtin.signal(),
  };

  event_bus.event_name.immediate.one(() => t.pass());
  event_bus.event_name.signal();
});

test(async function two_categories(t) {
  t.plan(1);

  let event_bus = {
    cat_one: {
      event_name: nbus.builtin.signal(),
    },
    cat_two: {
      event_name: nbus.builtin.signal(),
    }
  };

  event_bus.cat_one.event_name.immediate.one(() => t.pass());
  event_bus.cat_two.event_name.immediate.one(() => t.fail());
  event_bus.cat_one.event_name.signal();
});

test(async function two_signals(t) {
  t.plan(5);

  let event_bus = {
    first: nbus.builtin.signal(),
    second: nbus.builtin.signal(),
  };
  event_bus.first.use_single_buffer('immediate');
  event_bus.second.use_all_buffers(); // all modes enabled at the same time, default

  event_bus.first.immediate.one(() => t.pass());
  event_bus.first.signal();

  let n_counted_signals = 0;
  let n_immediate_signals = 0;

  event_bus.second.count.one((n_sigs) => n_counted_signals = n_sigs);
  event_bus.second.immediate.sub(() => n_immediate_signals += 1);

  event_bus.second.signal(); // immediate triggered here
  t.is(n_immediate_signals, 1)

  event_bus.second.signal(); // and here
  t.is(n_immediate_signals, 2)

  t.is(n_counted_signals, 0);

  event_bus.second.flush(); // count triggered here
  t.is(n_counted_signals, 2);
});

test(async function lazy(t) {
  t.plan(0);

  let event_bus = {
    event_name: nbus.builtin.signal(),
  };

  event_bus.event_name.signal();
  event_bus.event_name.count.sub(() => t.fail());
  event_bus.event_name.immediate.sub(() => t.fail());
});

test(async function simple_event(t) {
  t.plan(3);

  let event_bus = {
    cool_numbers: nbus.builtin.event<number>(),
  };

  event_bus.cool_numbers.immediate.one((ev:number) => t.is(ev, 5));
  // event_bus.cool_numbers.last.sub((ev:number) => t.is(ev, 10));
  event_bus.cool_numbers.list.sub((ev:number[]) => t.deepEqual(ev, [5, 10]));
  event_bus.cool_numbers.dispatch(5);

  event_bus.cool_numbers.immediate.one((ev:number) => t.is(ev, 10));
  event_bus.cool_numbers.dispatch(10);
  event_bus.cool_numbers.flush();
});
