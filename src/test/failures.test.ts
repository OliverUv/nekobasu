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


test.todo('Ensure can not use EventBus RESERVED_NAMES');

test(async function throws_on_reserved_name_use_neko(t) {
  let event_buffer = nbus.builtin.event_buffer;
  let create_signal_neko = nbus.create_signal_neko;
  let create_event_neko = nbus.create_neko;

  t.plan(6);

  let signal_a = { send: event_buffer.immediate<undefined>() };
  let signal_b = { flush: event_buffer.immediate<undefined>() };
  let signal_c = { _meta: event_buffer.immediate<undefined>() };

  t.throws(() => create_signal_neko<typeof signal_a>(signal_a));
  t.throws(() => create_signal_neko<typeof signal_b>(signal_b));
  t.throws(() => create_signal_neko<typeof signal_c>(signal_c));

  let event_a = { send: event_buffer.immediate<number>() };
  let event_b = { flush: event_buffer.immediate<number>() };
  let event_c = { _meta: event_buffer.immediate<number>() };

  t.throws(() => create_event_neko<number, typeof event_a>(event_a));
  t.throws(() => create_event_neko<number, typeof event_b>(event_b));
  t.throws(() => create_event_neko<number, typeof event_c>(event_c));
});

